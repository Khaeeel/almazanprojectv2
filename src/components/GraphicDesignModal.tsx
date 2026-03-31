import { useState } from "react";
import { config } from "../config";
import "./styles/GraphicDesignModal.css";

interface GraphicDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GraphicDesignModal = ({ isOpen, onClose }: GraphicDesignModalProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!isOpen) return null;

  const graphicDesigns = config.graphicDesignWorks;

  return (
    <>
      <div className="gd-modal-overlay" onClick={onClose} />
      <div className="gd-modal">
        <button className="gd-modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="gd-modal-content">
          <h2>Graphic Design Portfolio</h2>
          <p className="gd-modal-subtitle">
            Professional graphic design projects showcasing expertise in visual design, branding, logo design, and creative composition
          </p>

          <div className="gd-works-grid">
            {graphicDesigns.map((work, index) => (
              <div
                key={work.id}
                className="gd-work-card"
                onClick={() => setSelectedImage(index)}
                data-cursor="disable"
              >
                <div className="gd-work-image-wrapper">
                  <img src={work.image} alt={work.title} />
                  <div className="gd-work-overlay">
                    <h4>{work.title}</h4>
                    <p>{work.technologies}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedImage !== null && (
        <div className="gd-lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <button
            className="gd-lightbox-close"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
          <div className="gd-lightbox-container">
            <button
              className="gd-lightbox-nav gd-prev"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) =>
                  prev === 0 ? graphicDesigns.length - 1 : prev! - 1
                );
              }}
            >
              ←
            </button>

            <div className="gd-lightbox-content">
              <img
                src={graphicDesigns[selectedImage].image}
                alt={graphicDesigns[selectedImage].title}
              />
              <div className="gd-lightbox-info">
                <h3>{graphicDesigns[selectedImage].title}</h3>
                <p className="gd-lightbox-tools">
                  {graphicDesigns[selectedImage].technologies}
                </p>
                <p className="gd-lightbox-description">
                  {graphicDesigns[selectedImage].description}
                </p>
              </div>
            </div>

            <button
              className="gd-lightbox-nav gd-next"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) =>
                  prev === graphicDesigns.length - 1 ? 0 : prev! + 1
                );
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GraphicDesignModal;
