// import React from 'react'
// import GradientText from '../reactbits/GradientText'
// function Hello(user) {
//   return (
//     <div className="mt-5">
//         <div className="container">
//                         <GradientText
//                             colors={["#4b4ded", "#4776f4", "#4098ff", "#40baff", "#40daff"]}
//                             animationSpeed={5}
//                             showBorder={false}
//                             className="fade-in-bottom custom-class"
//                         >
//                             <h3 className="display-4">Hello, {user.username}</h3>
//                         </GradientText>
    
//                         <GradientText
//                             colors={["#6c6f7d", "#7a7d8a", "#8a8f99", "#9ba0a8", "#b0b4bb"]}
//                             animationSpeed={2}
//                             showBorder={false}
//                             className="fade-in-left custom-class"
//                         >
//                             <h3>Ask your health queries</h3>
//                         </GradientText>
    
//                     </div>
//     </div>
//   )
// }

// export default Hello


import React,{useContext} from "react";
import GradientText from "../reactbits/GradientText";
import { AuthContext } from '../context/AuthContext';
function Hello() {
  const {user} = useContext(AuthContext);
  return (
    <div className="mt-5">
      <div className="container">
        <GradientText
          colors={["#4b4ded", "#4776f4", "#4098ff", "#40baff", "#40daff"]}
          animationSpeed={5}
          showBorder={false}
          className="fade-in-bottom custom-class"
        >
          <h3 className="display-4">Hello, {user.username}</h3>
        </GradientText>

        <GradientText
          colors={["#6c6f7d", "#7a7d8a", "#8a8f99", "#9ba0a8", "#b0b4bb"]}
          animationSpeed={2}
          showBorder={false}
          className="fade-in-left custom-class"
        >
          <h3>Ask your health queries</h3>
        </GradientText>
      </div>
    </div>
  );
}

export default Hello;
