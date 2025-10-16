import React, { useEffect } from 'react';

const GlobalAdScripts: React.FC = () => {
  useEffect(() => {
    // Video slider ad script
    const sliderScript = document.createElement('script');
    sliderScript.async = true;
    sliderScript.src = "https://js.onclckmn.com/static/onclicka.js";
    sliderScript.setAttribute('data-admpid', '382319');
    sliderScript.id = 'slider-ad-script';
    document.body.appendChild(sliderScript);

    // Pop-under ad script
    const popunderScript = document.createElement('script');
    popunderScript.async = true;
    popunderScript.src = "https://js.onclckmn.com/static/onclicka.js";
    popunderScript.setAttribute('data-admpid', '382375');
    popunderScript.id = 'popunder-ad-script';
    document.body.appendChild(popunderScript);

    return () => {
      // Cleanup on component unmount
      const slider = document.getElementById('slider-ad-script');
      if (slider) {
        document.body.removeChild(slider);
      }
      const popunder = document.getElementById('popunder-ad-script');
      if (popunder) {
        document.body.removeChild(popunder);
      }
    };
  }, []);

  return null; // This component does not render anything
};

export default GlobalAdScripts;
