import React from 'react';
import lightBulbIcon from '../assets/icons/lightBulb.svg';
import progressionIcon from '../assets/icons/progressionIcon.svg';
import '../styles/CoachingCard.css'; // Optional: update path if needed

const CoachingCard = ({ title, tip, impact, onClick }) => {
  return (
    <div className="coaching-card" onClick={onClick}>
      <div className="coaching-card-header">
        <img src={lightBulbIcon} alt="Tip Icon" className="coaching-card-icon" />
        <h3 className="coaching-card-title">{title}</h3>
      </div>

      <p className="coaching-card-tip">{tip}</p>

      <div className="coaching-card-footer">
        <img src={progressionIcon} alt="Impact Icon" className="coaching-card-impact-icon" />
        <span className="coaching-card-impact">{impact}</span>
      </div>
    </div>
  );
};

export default CoachingCard;
