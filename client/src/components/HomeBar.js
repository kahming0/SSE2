import React, { useState } from 'react';
import CO2Calculation from './CO2Calculation';
import WhatIsHF from '../WhatIsHF';
import GeneralInfo from '../generalInfo';
import '../HomeBar.css';

export default function HomeBar() {
  const [isOpen, setIsOpen] = useState(true);
  const buttonSymbol = isOpen ? '▼' : '▶';

  const toggleOpen = () => {
	setIsOpen(!isOpen);
  };

  return (
	<div>
	  <div onClick={toggleOpen} class="HomeBar">
	    <button
		  style={{ cursor: "pointer", marginRight: "8px", fontSize: "18px", background: "none", border: "none" }}
	    >
		  {buttonSymbol}
	    </button>
	    <h2
		  style={{ display: "inline-block", fontSize: "24px", fontWeight: "bold" }}
	    >
		  Learn more
	    </h2>
	  </div>
	  {isOpen && (
			<div>	
				<div>
					<GeneralInfo/>
				</div>			
				<div>
					<WhatIsHF/>
				</div>
				<div>
					<CO2Calculation/>
				</div>
			</div>
	  )}
	</div>
  );
}
