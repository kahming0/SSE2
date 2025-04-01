import React, { useState } from 'react';

export default function WhatIsHF() {
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
          What are these tests?
        </h2>
      </div>
      {isOpen && (
        <div class="dropdownData">
          <p>
            Huggingface is a company which is dedicated to creating a community which can collaborate on machine learning models. 
            They allow users to train and share both models and datasets in order to train models. There are several evaluations on the performance 
            of each model, but in recent years the environmental impact has been a growing concern. This is not only in the impact of 
            training a model, but also in regular use. Available on the website is a leaderboard which compares the most efficient LLM's in terms 
            of performance along with Co2 cost for running them. This is the set of models which we have information on, as the only way that data 
            can be gathered in a way that can be properly compared is by actually executing these models with the same exact setup as the initial testers. 
          </p>
          <p>Estimates have been made into a leaderboard through a mixture of tests and heuristics, specifics of which can be seen in a dropdown below.
            A quick overview is that it factors in evaluation time, energy usage based off of the power consumption of the tested hardware, and the 
            carbon used to generate that energy. The tests used were the following 6 benchmarks, and total time spent on evaluation was recorded along with 
            performance ratings. 
          </p>

            <div style={{ paddingLeft: "16px" }}>
              <strong>IFEval</strong>   - A dataset designed to test a model’s ability to follow explicit instructions, such as “include keyword x” or “use format y.”  <br/>
              <strong>BBH</strong>      - Big Bench Hard, a collection of tests for LLM's across domains such as language understanding, mathematical reasoning and common sense and world knowledge <br />
              <strong>MATH</strong>     - A compilation of high school level competition problems. In this example they only keep 'level 5' math questions.<br />
              <strong>GPQA</strong>     - Graduate-Level Google-Proof Q&A Benchmark, a highly challenging set of questions on PhD level biolog, physics and chemistry. <br />
              <strong>MuSR</strong>     - Multistep Soft Reasoning, a dataset of language based questions, each roughly 1000 words long. Requires models to be able to parse very long data and keep context. <br />
              <strong>MMLU-PRO</strong> - Massive Multitask Language Understanding - Professional, a set of expertly reviewed multiple choice questions over multiple domains.  <br />
            </div>

        </div>
      )}
    </div>
  );
}
