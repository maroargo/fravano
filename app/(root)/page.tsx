import Link from "next/link";

export default async function Init() {  

  return (   
    <div className="landing-page-container">
      <div className="header">
        <h1 className="title">My Health Ride</h1>
        <p className="subtitle">Your health is our priority, we transport with safety and confidence.</p>
      </div>

      <div className="content">
        <h2 className="content-title">Welcome</h2>
        <p className="content-description">
        We have specialized vehicles for transporting patients, ensuring comfort and quality care during the transfer.
        </p>
        <Link className="login-button" href="/login">Login</Link>        
      </div>

      <div className="footer">
        <p className="footer-text">© 2025 My Health Ride | All rights reserved.</p>
      </div>
    </div>  
    
  );
}
