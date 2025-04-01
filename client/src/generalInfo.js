import React, { useState } from 'react';

export default function GeneralInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonSymbol = isOpen ? '▼' : '▶';

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={toggleOpen} style={{width:'100%', cursor:'pointer', paddingLeft: "30px" }} class="HomeBar">
        <button
          style={{ cursor: "pointer", marginRight: "8px", fontSize: "18px", background: "none", border: "none" }}
        >
          {buttonSymbol}
        </button>
        <h2
          style={{ display: "inline-block", fontSize: "24px", fontWeight: "bold", color: "#2D3748", cursor: "pointer", margin:0}}
        >
          General Info
        </h2>
      </div>
      {isOpen && (
        <div class="dropdownData">
          <p>
            Large Learning Models (LLM's) have increased in use significantly since 2018, and with it come concerns their environmental impact. <br/>
            This website aims to educate users on the often invisible impacts of using some of these models, and potentially provide some better alternatives to them. This only covers the cost of using the existing models, 
            it does not include the cost of training them in any way. 

            TODO: Add more data
          </p>



        </div>
      )}
    </div>
  );
}
