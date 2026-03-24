import "./styles/Certificates.css";
import { config } from "../config";

const Certificates = () => {
  return (
    <div className="certificates-section section-container">
      <div className="certificates-container">
        <h2>
          My certificates <span>&</span>
          <br /> achievements
        </h2>
        <div className="certificates-grid">
          {config.certificates.map((cert, index) => (
            <div key={index} className="certificate-card">
              <div className="certificate-image">
                <img src={cert.image} alt={cert.title} />
              </div>
              <div className="certificate-info">
                <h3>{cert.title}</h3>
                <h4>{cert.issuer}</h4>
                <p>{cert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
