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
            This website aims to educate users on the often invisible impacts of using some of these models, and potentially provide some better 
            alternatives to them. This only covers the cost of using the existing models, it does not include the cost of training them in any way. 
          </p>

          <p> 
            Bringing attention to the true cost of using several models can help users in making more informed decisions on which models 
            to use, or if they should use them at all. If a model is to be used, a user may as well use the model which gives the 
            best performance for the lowest emmission for the desired use case. <br/> 
            As an example, on pure average performance MaziyarPanahi/calme-3.2-instruct-78b
            is ranked the highest overall, with an average score of 52.08%, for a CO2 cost of 66.01kg. Just looking at the numbers however, 
            the dfurman/CalmeRys-78B-Orpo-v0.1 model has an average score of 51.23%, matching or even exceeding the other model, while having 
            a CO2 cost of 25.99kg, less than half. Along with this, there are instances of models which are very specialised for certain 
            purposes but perform poorly on average. If one of these models has low CO2 cost, then it may still be the best tool to use 
            for that desired purpose. 
          </p>

          <p>
            While not displayed in this website, the cost of training these models is also incredibly impactful. Several large corporations with 
            access to an incredible amount of resources train their models for maximum effectiveness while largely ignoring the cost of this. 
            This generally allows them to create the newest most effective models before anyone else, but at the cost of an incredible amount of 
            energy. Meta's OPT model was trained with the equivalent of 75 tons of CO2, but the LLama 3 model was trained using the equivalent 
            of 2290 tons of CO2. If more attention is brought to the environmental impact, then more focus may be put on increasing the efficiency of 
            the algorithms used to train, or on improving the data used as opposed to simply brute forcing more data. Alternatively, we could also 
            think more on if we really need to use machine learning on everything, as it is very energetically expensive compared to other solutions.
          </p>

        </div>
      )}
    </div>
  );
}
