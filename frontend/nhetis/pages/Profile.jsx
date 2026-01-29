// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import PatientInfo from '../components/PatientInfo';
// import MedicationInfo from '../components/MedicationInfo';
// import { AuthContext } from '../context/AuthContext';
// import { useLocation } from "react-router-dom";

// function Profile() {
//     const { logout } = useContext(AuthContext);
//     const location = useLocation();
//     const { patient,medications } = location.state || {};
//     console.log("Pp: ",patient);   
//     return (
//         <>
//             <Link to={"/"}>    <div className="btn btn-outline-primary m-2"><i className="bi bi-arrow-left"></i> Go Back</div></Link>
//             {patient && Object.keys(patient).length!==0 && <div className="row justify-content-between">
//                 <div className="col d-flex justify-content-center">
//                     <PatientInfo patient={patient} />
//                 </div>
//                 <div className="col d-flex justify-content-center">
//                     <MedicationInfo medications={medications} />
//                 </div>
                
//             </div>}

//             <div className="row mx-1 mt-5">
//                 <Link to="/" onClick={logout} className="btn btn-outline-danger">
//   Logout <i className="bi bi-box-arrow-right"></i>
// </Link>

//             </div>

//         </>
//     )
// }

// export default Profile

// // Profile.jsx
// // import React, { useContext } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import PatientInfo from "../components/PatientInfo";
// // import MedicationInfo from "../components/MedicationInfo";
// // import { AuthContext } from "../context/AuthContext";

// // function Profile() {
// //   const { logout } = useContext(AuthContext);
// //   const location = useLocation();
// //   const { patient, medications } = location.state || {};

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      
// //       {/* Back Button */}
// //       <div className="mb-6">
// //         <Link to={"/"}>
// //           <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-100 transition">
// //             <i className="bi bi-arrow-left"></i> Go Back
// //           </button>
// //         </Link>
// //       </div>

// //       {/* Patient + Medication Info */}
// //       {patient && Object.keys(patient).length !== 0 && (
// //         <div className="grid md:grid-cols-2 gap-8">
// //           {/* Patient Info */}
// //           <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
// //             <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
// //               <i className="bi bi-person-badge text-blue-500"></i> Patient Info
// //             </h2>
// //             <PatientInfo patient={patient} />
// //           </div>

// //           {/* Medications */}
// //           <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
// //             <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
// //               <i className="bi bi-capsule text-green-500"></i> Medications
// //             </h2>
// //             <MedicationInfo medications={medications} />
// //           </div>
// //         </div>
// //       )}

// //       {/* Logout Button */}
// //       <div className="mt-10 flex justify-center">
// //         <Link
// //           to="/"
// //           onClick={logout}
// //           className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
// //         >
// //           Logout <i className="bi bi-box-arrow-right"></i>
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Profile;


import React, { useContext } from 'react';
import { Link, useLocation,useNavigate} from 'react-router-dom';
import PatientInfo from '../components/PatientInfo';
import MedicationInfo from '../components/MedicationInfo';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const { patient, medications } = location.state || {};
  const navigate= useNavigate();
  async function handleLogout(){
    const ok=await logout();
    if(ok) navigate("/login");
  }
  return (
    <div className="container py-4">
      {/* Back button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left"></i> Go Back
        </Link>
        <button onClick={handleLogout} className="btn btn-outline-danger">
          Logout <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>

      {/* Main Content */}
      {patient && Object.keys(patient).length !== 0 && (
        <div className="row g-4">
          {/* Patient Info */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header fw-bold">
                Patient Demographics
              </div>
              <div className="card-body">
                <PatientInfo patient={patient} />
              </div>
            </div>
          </div>

          {/* Medication Info */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header fw-bold">
                Medications
              </div>
              <div className="card-body">
                <MedicationInfo medications={medications} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
