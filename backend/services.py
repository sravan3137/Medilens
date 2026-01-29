# # RAG_CONFIG = settings.RAG_CONFIG
# # rag_core/services.py

# import sqlite3
# import faiss
# import requests
# import json
# import pandas as pd
# import torch
# from sentence_transformers import SentenceTransformer
# import matplotlib

# matplotlib.use('Agg')  # Use a non-interactive backend for server environments
# import matplotlib.pyplot as plt
# import io
# import base64

# # Import config from Django settings
# from django.conf import settings




# class RAGService:
#     def __init__(self):
#         """
#         Initializes the service, loading models and connecting to the DB.
#         """
#         self.conn = sqlite3.connect(RAG_CONFIG["DB_PATH"], check_same_thread=False)
#         self.text_model = SentenceTransformer("all-MiniLM-L6-v2")
#         print("Building FAISS index...")
#         self.faiss_index, self.all_texts = self._build_faiss_index()
#         print("FAISS index ready.")

#     def _get_iam_token(self):
#         token_url = "https://iam.cloud.ibm.com/identity/token"
#         headers = {"Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"}
#         data = {"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": RAG_CONFIG["API_KEY"]}
#         resp = requests.post(token_url, headers=headers, data=data)
#         resp.raise_for_status()
#         return resp.json()["access_token"]

#     def _granite_llm(self, context: str, question: str) -> str:
#         iam_token = self._get_iam_token()
#         headers = {
#             "Content-Type": "application/json",
#             "Accept": "application/json",
#             "Authorization": f"Bearer {iam_token}",
#         }
#         payload = {
#             "parameters": {
#                 "prompt_variables": {"context": context, "question": question},
#                 "stop_sequences": ["Question:"],
#             }
#         }
#         resp = requests.post(RAG_CONFIG["GEN_URL"], headers=headers, json=payload)
#         resp.raise_for_status()
#         result = resp.json()
#         try:
#             return result["results"][0]["generated_text"]
#         except (KeyError, IndexError):
#             return json.dumps(result, indent=2)

#     def _build_faiss_index(self):
#         cursor = self.conn.cursor()
#         rows = cursor.execute("SELECT patient_id FROM patients").fetchall()
#         all_texts = []
#         for (patient_id,) in rows:
#             conditions = cursor.execute("SELECT condition FROM conditions WHERE patient_id=?", (patient_id,)).fetchall()
#             meds = cursor.execute("SELECT medication FROM medications WHERE patient_id=?", (patient_id,)).fetchall()
#             encounters = cursor.execute("SELECT reason FROM encounters WHERE patient_id=?", (patient_id,)).fetchall()
#             text = f"""
#             Patient: {patient_id}
#             Conditions: {', '.join(c[0] for c in conditions) if conditions else 'None'}
#             Medications: {', '.join(m[0] for m in meds) if meds else 'None'}
#             Encounters: {', '.join(e[0] for e in encounters) if encounters else 'None'}
#             """
#             all_texts.append(text.strip())
#         embeddings = self.text_model.encode(all_texts, convert_to_numpy=True)
#         index = faiss.IndexFlatL2(embeddings.shape[1])
#         index.add(embeddings)
#         return index, all_texts

#     def _search_faiss(self, query, k=3):
#         emb = self.text_model.encode([query], convert_to_numpy=True)
#         _, I = self.faiss_index.search(emb, k)
#         return [self.all_texts[i] for i in I[0]]

#     def _get_patient_context(self, patient_id):
#         """
#         Fetches and formats a comprehensive context for a given patient_id
#         from all relevant tables in the database.
#         """
#         cursor = self.conn.cursor()
#         context = []

#         # 1. Patients Table (Demographics)
#         patient_row = cursor.execute(
#             "SELECT name, gender, dob, age, height_cm, weight_kg, bmi FROM patients WHERE patient_id=?", (patient_id,)
#         ).fetchone()
#         if patient_row:
#             context.append(
#                 f"Patient Demographics: Name: {patient_row[0]}, Gender: {patient_row[1]}, DOB: {patient_row[2]} (Age {patient_row[3]}), "
#                 f"Height: {patient_row[4]} cm, Weight: {patient_row[5]} kg, BMI: {patient_row[6]}"
#             )

#         # 2. Conditions Table
#         conditions = cursor.execute(
#             "SELECT condition, onset_date, status FROM conditions WHERE patient_id=?", (patient_id,)
#         ).fetchall()
#         if conditions:
#             condition_list = [f"{c[0]} (Onset: {c[1]}, Status: {c[2]})" for c in conditions]
#             context.append("Conditions: " + "; ".join(condition_list))

#         # 3. Medications Table
#         meds = cursor.execute(
#             "SELECT medication, dose, frequency FROM medications WHERE patient_id=?", (patient_id,)
#         ).fetchall()
#         if meds:
#             med_list = [f"{m[0]} {m[1]} {m[2]}" for m in meds]
#             context.append("Medications: " + "; ".join(med_list))

#         # 4. Labs Table
#         labs = cursor.execute(
#             """SELECT date, hba1c_percent, fasting_glucose_mg_dL, chol_total_mg_dL,
#                       ldl_mg_dL, creatinine_mg_dL, egfr_mL_min_1_73m2
#                FROM labs WHERE patient_id=? ORDER BY date DESC""",
#             (patient_id,)
#         ).fetchall()
#         if labs:
#             lab_list = [
#                 f"On {l[0]}: HbA1c={l[1]}%, Glucose={l[2]}, Total Chol={l[3]}, LDL={l[4]}, Creatinine={l[5]}, eGFR={l[6]}"
#                 for l in labs
#             ]
#             context.append("Lab Results: " + "; ".join(lab_list))

#         # 5. Vitals Table
#         vitals = cursor.execute(
#             "SELECT date, systolic_bp, diastolic_bp, hr, weight_kg, bmi FROM vitals WHERE patient_id=? ORDER BY date DESC",
#             (patient_id,)
#         ).fetchall()
#         if vitals:
#             vital_list = [
#                 f"On {v[0]}: BP={v[1]}/{v[2]}, HR={v[3]}, Wt={v[4]}kg, BMI={v[5]}"
#                 for v in vitals
#             ]
#             context.append("Vitals: " + "; ".join(vital_list))

#         # 6. Encounters Table
#         encounters = cursor.execute(
#             "SELECT date, type, reason FROM encounters WHERE patient_id=? ORDER BY date DESC", (patient_id,)
#         ).fetchall()
#         if encounters:
#             encounter_list = [f"{e[0]} ({e[1]}): {e[2]}" for e in encounters]
#             context.append("Encounters: " + "; ".join(encounter_list))

#         # 7. Imaging Reports Table
#         imaging = cursor.execute(
#             "SELECT date, modality, report FROM imaging_reports WHERE patient_id=? ORDER BY date DESC",
#             (patient_id,)
#         ).fetchall()
#         if imaging:
#             imaging_list = [f"{img[0]} ({img[1]}): {img[2]}" for img in imaging]
#             context.append("Imaging Reports: " + "; ".join(imaging_list))

#         # 8. Clinical Notes Table
#         notes = cursor.execute(
#             "SELECT date, note FROM clinical_notes WHERE patient_id=? ORDER BY date DESC", (patient_id,)
#         ).fetchall()
#         if notes:
#             note_list = [f"On {n[0]}: {n[1]}" for n in notes]
#             context.append("Clinical Notes: " + "; ".join(note_list))

#         return "\n".join(context)

#     def _get_patient_attributes(self, patient_id, attributes):
#         attribute_map = {"bp": "systolic_bp, diastolic_bp", "glucose": "fasting_glucose_mg_dL"}
#         df_dict = {}
#         for attr in attributes:
#             cols = attribute_map.get(attr.lower())
#             if not cols: continue
#             table = "vitals" if attr.lower() in ["bp"] else "labs"
#             query = f"SELECT date, {cols} FROM {table} WHERE patient_id=? ORDER BY date ASC"
#             df = pd.read_sql_query(query, self.conn, params=(patient_id,))
#             df['date'] = pd.to_datetime(df['date'])
#             df_dict[attr] = df
#         return df_dict

#     def _plot_to_base64(self, df_dict):
#         images_b64 = {}
#         for attr, df in df_dict.items():
#             if df.empty: continue
#             plt.figure(figsize=(10, 5))
#             for col in df.columns:
#                 if col != "date":
#                     plt.plot(df['date'], df[col], marker='o', label=col)
#             plt.title(f"{attr.capitalize()} Trends Over Time")
#             plt.legend()
#             plt.grid(True)
#             buf = io.BytesIO()
#             plt.savefig(buf, format='png', bbox_inches='tight')
#             plt.close()
#             buf.seek(0)
#             images_b64[attr] = base64.b64encode(buf.getvalue()).decode('utf-8')
#         return images_b64

#     def _predict_disease_and_plot(self, patient_id):
#         prompt = f"Based on patient {patient_id}'s history, predict future diseases..."
#         result = self._granite_llm(prompt, "Predict future disease likelihoods")
#         try:
#             disease_dict = json.loads(result)
#         except json.JSONDecodeError:
#             return None, None
#         plt.figure(figsize=(8, 4))
#         plt.bar(disease_dict.keys(), disease_dict.values(), color='tomato')
#         plt.ylabel("Risk (%)")
#         plt.xticks(rotation=45, ha='right')
#         plt.title("Predicted Future Disease Likelihoods")
#         buf = io.BytesIO()
#         plt.savefig(buf, format='png', bbox_inches='tight')
#         plt.close()
#         buf.seek(0)
#         image_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
#         return disease_dict, image_b64

#     def ask(self, patient_name, question):
#         """The main method that orchestrates the RAG pipeline."""
#         cursor = self.conn.cursor()
#         pid_row = cursor.execute("SELECT patient_id FROM patients WHERE name=?", (patient_name,)).fetchone()
#         if not pid_row:
#             raise ValueError(f"Patient '{patient_name}' not found.")
#         patient_id = pid_row[0]

#         response = {}
#         images = {}

#         # Detect requests for plots
#         attributes = ["bp", "glucose"]
#         queried_attrs = [attr for attr in attributes if attr in question.lower()]
#         if queried_attrs:
#             df_dict = self._get_patient_attributes(patient_id, queried_attrs)
#             images.update(self._plot_to_base64(df_dict))

#         # Detect future disease prediction request
#         if "future disease" in question.lower() or "predict disease" in question.lower():
#             disease_data, disease_plot = self._predict_disease_and_plot(patient_id)
#             if disease_data:
#                 response['disease_prediction'] = disease_data
#                 images['disease_prediction_plot'] = disease_plot

#         # Get the text-based RAG answer
#         structured_context = self._get_patient_context(patient_id)
#         similar_cases = self._search_faiss(question, k=3)
#         full_context = f"=== Patient Data ===\n{structured_context}\n\n=== Similar Cases ===\n{chr(10).join(similar_cases)}"

#         response['text_answer'] = self._granite_llm(full_context, question)
#         response['images'] = images

#         return response
# services.py

import os
import sqlite3
import faiss
import numpy as np
import replicate
from sentence_transformers import SentenceTransformer
from dataclasses import dataclass


from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Now you can get the token
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
if not REPLICATE_API_TOKEN:
    raise RuntimeError("REPLICATE_API_TOKEN is not set.")


# ===============================
# CONFIG
# ===============================

DB_PATH = "synthetic_pat (1).db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
LLM_MODEL = "ibm-granite/granite-3.3-8b-instruct"

# ===============================
# SAFETY CHECK
# ===============================

if not os.getenv("REPLICATE_API_TOKEN"):
    raise RuntimeError(
        "REPLICATE_API_TOKEN is not set. "
        "Export it as an environment variable."
    )

# ===============================
# RAG SERVICE
# ===============================
@dataclass
class Doc:
    text: str
    user_id: str
    table: str
        
class RAGService:
    def __init__(self):
        print("🚀 Initializing RAG Service...")

        # Database
        self.conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        self.cursor = self.conn.cursor()

        # Embedding model
        self.embedder = SentenceTransformer(EMBEDDING_MODEL)

        # Build corpus and FAISS index
        self.documents = self._build_documents()
        self.index = self._build_faiss_index()

        print("✅ RAG Service Ready")

    # -----------------------------
    # Build documents from DB
    # -----------------------------


    

    def _build_documents(self):
        documents = []

        tables = [
            "patients",
            "conditions",
            "medications",
            "labs",
            "vitals",
            "clinical_notes",
        ]

        for table in tables:
            try:
                rows = self.cursor.execute(f"SELECT * FROM {table}").fetchall()
                cols = [c[0] for c in self.cursor.description]

                for row in rows:
                    row_dict = dict(zip(cols, row))
                    user_id = str(row_dict.get("patient_id"))

                    if not user_id:
                        continue

                    text = f"Table: {table}\n"
                    for col, val in row_dict.items():
                        if val is not None:
                            text += f"{col}: {val}\n"

                    documents.append(
                        Doc(
                            text=text.strip(),
                            user_id=user_id,
                            table=table
                        )
                    )

            except Exception as e:
                print(f"⚠️ Skipping table {table}: {e}")

        print(f"📄 Loaded {len(documents)} documents")
        return documents

    # -----------------------------
    # Build FAISS index
    # -----------------------------
    
    def _build_faiss_index(self):
        print("🧠 Embedding documents (one-time cost)...")

        texts = [doc.text for doc in self.documents]

        embeddings = self.embedder.encode(
            texts,
            show_progress_bar=True
        ).astype("float32")
        if embeddings.ndim == 1:
            embeddings = embeddings.reshape(1, -1)      
        index = faiss.IndexFlatL2(embeddings.shape[1])
        index.add(embeddings)

        # 🔑 Store metadata alongside FAISS
        self.doc_store = self.documents

        print(f"📌 FAISS index size: {index.ntotal}")
        return index


    # -----------------------------
    # Main RAG method
    # -----------------------------
    def ask(self, question: str, user_id: str,role:str, k: int = 5) -> str:
        q_emb = self.embedder.encode([question]).astype("float32")
        D, I = self.index.search(q_emb, k * 3)  # retrieve extra to filter

        # Filter by user_id
        filtered_docs = [
            self.doc_store[i] for i in I[0] if self.doc_store[i].user_id == user_id
        ][:k]

        if not filtered_docs:
            return "Not found in records"

        context = "\n\n".join(doc.text for doc in filtered_docs)

        
        prompt = f"""
        You are a medical data assistant.

        IMPORTANT RULES:
        - The requester role is: {role}
        - The medical records provided belong ONLY to the patient with ID {user_id}
        - You ONLY know information present in the patient records.
        - You do NOT know anything about the requester unless explicitly provided.
        - If a question is about the requester (doctor/admin) and not the patient, reply:
        "I don't have information about that."

        - If a question is unrelated to the patient records, reply:
        "I don't have information about that."

        - Do NOT infer roles, identities, or personal details.
        - Do NOT provide medical advice.

        Context (Patient Records):
        {context}

        Question:
        {question}

        Answer:
        """


        output = replicate.run(
            LLM_MODEL,
            input={
                "prompt": prompt,
                "max_new_tokens": 300,
                "temperature": 0.2,
            }
        )

        return "".join(output)

