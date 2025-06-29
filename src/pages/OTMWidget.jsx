// import React, { useEffect } from "react";

// const OTPWidget = () => {
//   useEffect(() => {
//     const configuration = {
//       widgetId: "35667a705579363832363233", // replace with your widgetId
//       tokenAuth: "456251TM7QdBi8x9685d7bdcP1",      // replace with your MSG91 Auth Token
//       identifier: "",                       // optional: phone/email
//       exposeMethods: true,
//       success: (data) => {
//         console.log("✅ OTP Verified:", data);
//       },
//       failure: (error) => {
//         console.error("❌ OTP Failed:", error);
//       },
//     };

//     // Create the script tag dynamically
//     const script = document.createElement("script");
//     script.src = "https://verify.msg91.com/otp-provider.js";
//     script.type = "text/javascript";
//     script.onload = () => {
//       if (window.initSendOTP) {
//         window.initSendOTP(configuration);
//       } else {
//         console.error("initSendOTP not available");
//       }
//     };

//     document.body.appendChild(script);

//     // Cleanup on unmount
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div>
//       <h2>Verify Your Phone Number or Email</h2>
//       <div id="otp-container" />
//     </div>
//   );
// };

// export default OTPWidget;


import React, { useEffect } from "react";

const OTPWidget = () => {
  useEffect(() => {
    // Prevent duplicate script or element registration
    if (!window.initSendOTP || !document.querySelector("script[src='https://verify.msg91.com/otp-provider.js']")) {
      // Configuration
      const configuration = {
        widgetId: "35667a705579363832363233", // your widget ID
        tokenAuth: "456251TM7QdBi8x9685d7bdcP1",        // your MSG91 token
        identifier: "",                       // optional mobile/email
        exposeMethods: true,
        success: (data) => {
          console.log("✅ OTP Verified:", data);
        },
        failure: (error) => {
          console.error("❌ OTP Failed:", error);
        },
      };

      // Inject script only once
      const script = document.createElement("script");
      script.src = "https://verify.msg91.com/otp-provider.js";
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => {
        if (window.initSendOTP) {
          window.initSendOTP(configuration);
        }
      };

      document.body.appendChild(script);
    }

    // No script cleanup to avoid reloading multiple times on hot reload
  }, []);

  return (
    <div>
      <h2>OTP Verification</h2>
      <div id="otp-container" />
    </div>
  );
};

export default OTPWidget;