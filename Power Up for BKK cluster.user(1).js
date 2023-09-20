// ==UserScript==
// @name         Power Up for BKK cluster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make power ups faster
// @downloadURL  https://drive.corp.amazon.com/view/essameem@/TamperMonkey%20Scripts/Power%20Up.user.js
// @updateURL    https://drive.corp.amazon.com/view/essameem@/TamperMonkey%20Scripts/Power%20Up.user.js
// @author       Wachirawit Pinnarat
// @match        https://t.corp.amazon.com/*
// @match        https://tt.amazon.com/*
// @icon         https://cdn.dribbble.com/users/207719/screenshots/1062589/charles_superhero.jpg
// @require      https://drive.corp.amazon.com/view/puffenba@/MonkeyScripts/puffenba_library/1.2.2/puffenba_library.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';
    // Using puffenba library to import observe mutation function.
    const puffenba_lib = new puffenba_library({getAlias: true, getLocation: true, getLocationFromTicket: true});//initialize the helper library /* Documentation: https://w.amazon.com/bin/view/Users/puffenba/Script_Library */
    const showChangeLogOnUpdate = false;//should the change log be shown automatically when the script is updated to this version

    let count = 0;
    puffenba_lib.observe(document.body, updatePage);

    // Create a Mutation Observer to watch for changes in the document
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            // Check if the form element or any of its descendants have been added or modified
            if (mutation.target.id === 'power-up-form' || mutation.target.closest('#power-up-form')) {
                // Repopulate the form fields with the saved data
                saveFormDataToSession();
                populateFormFromSession();
                break;
            }
        }
    });


    // Start observing the document for changes to the form
    observer.observe(document, { childList: true, subtree: true });

    function updatePage() {
        if (count !== 0) {
            addPowerUpButton();
            const event = new Event('click');
            const targetElement = document.querySelector('.power-up-button-created');
            targetElement && targetElement.dispatchEvent(event);
            saveFormDataToSession();
            populateFormFromSession();


        } else {
            addPowerUpButton();
            count = 0;
        }
    }

    // Creating two funcitons below to save data to sessionStorage and populate it again from there.
    function saveFormDataToSession() {
        const formElement = document.getElementById('power-up-form');
        if (formElement) {
            const formData = new FormData(formElement);
            const formDataJSON = JSON.stringify(Object.fromEntries(formData.entries()));
            sessionStorage.setItem('form_data1', formDataJSON);
        }else {
            console.log("saveFormDataToSession: power up form not found");
        }
    }

    // 2nd function
    function populateFormFromSession() {
        const formDataJSON = sessionStorage.getItem('form_data1');
        if (formDataJSON) {
            const formData = JSON.parse(formDataJSON);
            const formElement = document.getElementById('power-up-form');
            if (formElement) {
                for (const key in formData) {
                    if (formData.hasOwnProperty(key)) {
                        const inputElement = formElement.elements[key];
                        if (inputElement) {
                            inputElement.value = formData[key];
                        }
                    }
                }
            }
        }
    }


    // Save form data to localStorage used for saving form readio inputs
    function saveFormData() {
        const formElement = document.getElementById('power-up-form');
        if (formElement) {
            const formData = new FormData(formElement);
            const formDataJSON = JSON.stringify(Object.fromEntries(formData.entries()));
            localStorage.setItem('form_data', formDataJSON);
        }
    }

    // Retrieve form data from localStorage and populate the form fields for readio options
    function populateFormFromStorage() {
        const formDataJSON = localStorage.getItem('form_data');
        if (formDataJSON) {
            const formData = JSON.parse(formDataJSON);
            formData["block-input"] = "";
            formData["cir-input"] = "";
            formData["panel-input"] = "";
            formData["ats-input"] = "";
            //formData["tpvr-input"] = "";
            formData["voltage-radio-options"] = "";
            formData["ats-radio-options"] = "";
            if (formData["battery-radio-options"] !== "N/A") { // The script will remember if only user select N/A otherwise it will set back to default value (successfull)
                formData["battery-radio-options"] = "";
            }
            if (formData["dcorep-radio-options"] !== "N/A") {formData["dcorep-radio-options"] = "";}
            if (formData["dceorep-radio-options"] !== "N/A") {formData["dceorep-radio-options"] = "";}
            if (formData["dceoobs-radio-options"] !== "N/A") {formData["dceoobs-radio-options"] = "";}
            if (formData["dceocon-radio-options"] !== "N/A") {formData["dceocon-radio-options"] = "";}
            if (formData["preflip-radio-options"] !== "N/A") {formData["preflip-radio-options"] = "";}
            if (formData["posflip-radio-options"] !== "N/A") {formData["posflip-radio-options"] = "";}
            if (formData["rfd-radio-options"] !== "N/A") {formData["rfd-radio-options"] = "";}
            if (formData["air-radio-options"] !== "N/A") {formData["air-radio-options"] = "";}
            if (formData["hot-radio-options"] !== "N/A") {formData["hot-radio-options"] = "";}
            if (formData["cir1-radio-options"] !== "N/A") {formData["cir1-radio-options"] = "";}
            if (formData["cir2-radio-options"] !== "N/A") {formData["cir2-radio-options"] = "";}
            if (formData["cir3-radio-options"] !== "N/A") {formData["cir3-radio-options"] = "";}
            if (formData["pow-radio-options"] !== "N/A") {formData["pow-radio-options"] = "";}
            if (formData["ins-radio-options"] !== "N/A") {formData["ins-radio-options"] = "";}

            //if (formData["rfd-radio-options"] !== "N/A") {formData["rfd-radio-options"] = "";}
            //if (formData["psu-radio-options"] !== "N/A") {formData["psu-radio-options"] = "";}
            const formElement = document.getElementById('power-up-form');
            if (formElement) {
                for (const key in formData) {
                    if (formData.hasOwnProperty(key)) {
                        const inputElement = formElement.elements[key];
                        if (inputElement) {
                            inputElement.value = formData[key];
                        }
                    }
                }
            }
        }
    }

    // Function to insert the comment into the comment box
    function insertComment(commentText) {
        let commentBox = document.querySelector('#sim-communicationActions--createComment');
        if (commentBox) {
            let nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeTextAreaValueSetter.call(commentBox, commentText);
            commentBox.dispatchEvent(new Event('change', { bubbles: true }));
            commentBox.focus();
        }
    }

    // Function to prompt the user for input and insert the comment
    function showPromptAndInsertComment() {
        // This funciton is only invoked if user press (CTRL + .)
        //         let input1 = prompt("Current Panel Info:\nRPP-(??)-R21-(??-??)-CIRCUIT (?? & ??)\n\nEnter block Info (Ex: A21): ");
        //         if (input1 === null) return; // If the user cancel the first prompt then the funtion will stop.
        //         let input2 = prompt("Current Panel Info:\nRPP-" + input1 + "-R21-(??-??)-CIRCUIT (?? & ??)\n\nEnter RPP Panel numbers (Ex: 01-01):");
        //         let input3 = prompt("Current Panel Info:\nRPP-" + input1 + "-R21-" + input2 + "-CIRCUIT (?? & ??)\n\nEnter Circuits separated with space (Ex: 45 46): ");
        //         let [cir1, cir2] = input3.split(" ");
        //         let cir;
        //         if (!cir2) {
        //             cir = input3;
        //         } else {
        //             if (cir1 === " ") {
        //                 cir = input3;
        //             } else {
        //                 cir = `${cir1} & ${cir2}`;
        //             }
        //         }
        //         // Used localstorage to store the verifir alias then
        //         let verifier = prompt(`Who is your TPVR?\n\nEnter Alias (Leave blank to use previous TPVR): `, `${localStorage.getItem("tpvr")}`);

        //         if (verifier){
        //             localStorage.setItem("tpvr", verifier); // Sends the verifier value to localstorage
        //         }
        //         let tpvr = localStorage.getItem("tpvr"); // Retrieves the verifier value from localstorage
        //         let textArea = "";
        //         textArea = `RPP-${input1.toUpperCase()}-R21-${input2}-CIRCUIT ${cir}
        // RPP-${input1.toUpperCase()}-R22-${input2}-CIRCUIT ${cir}

        // Voltage Check: COMPLETED
        // Performed ATS flip test: OK
        // Performed Battery test: OK
        // Power Up: COMPLETED
        // HAC: N/A

        // TPVR: ${tpvr}`;
        //         alert(`Please DON'T forget to perform the following: \n\n- ATS flip test\n- Battery test\n- HAC removal`);
        //         insertComment(textArea);


        // Instead of above code, this function will switch to Communication tab and open up the power up form.
        const tabs = document.querySelector(`ul[class*='awsui_tabs-header-list'] li:nth-child(2)`);
        if (tabs) {
            const commsTab = tabs.querySelector(`a`);
            commsTab && commsTab.click();
        }

        setTimeout(openform, 600);

        function openform () {
            const targetElement = document.querySelector('.power-up-button-created');
            targetElement && targetElement.click();
            populateFormFromStorage();
            populateFormFromSession();
        }
    }

    // Function to add the power up button to the page
    function addPowerUpButton() {

        if (document.getElementById("power-up-button")) {
            return; // If the button already exists, do nothing
        }

        var topContainer = document.querySelector(".editor-confirm");

        if (!topContainer) {
            // If the topContainer is not available yet, wait for a short delay and try again
            setTimeout(addPowerUpButton, 300);
            return;
        }

        var buttonDiv = document.createElement("div");
        buttonDiv.setAttribute("id", "button-div");
        var powerUpButton = document.createElement("button");

        powerUpButton.setAttribute(
            "class",
            "awsui-button awsui-button-variant-primary awsui-hover-child-icons power-up-button-created"
        );

        topContainer.id = "power-up-button";

        buttonDiv.style.margin = "1rem";

        powerUpButton.innerText = " ⚡POWER UP FOR BKK CLUSTER";

        powerUpButton.style.cssText = `transition: all 0.5s;
                                  cursor: pointer;
                                  box-shadow: 0 10px 20px -8px rgba(0, 0, 0, 0.7);
                                  background-color: #21252c;
                                  padding: 12px;
                                  color: white;
                                 `;

        powerUpButton.onmouseover = function () {
            powerUpButton.style.padding = "12px";
            powerUpButton.style.backgroundColor = "#14B544";
            powerUpButton.style.paddingRight = "20px";
            powerUpButton.style.paddingLeft = "4px";
            powerUpButton.style.color = "rgba(255, 255, 255, 1)";
            powerUpButton.style.boxShadow = "0 5px 15px rgba(255, 255, 0, 0.6)";
        };

        powerUpButton.onmouseout = function () {
            powerUpButton.style.backgroundColor = "#21252c";
            powerUpButton.style.paddingRight = "12px";
            powerUpButton.style.paddingLeft = "12px";
            powerUpButton.style.padding = "12px";
            powerUpButton.style.color = "white";
            powerUpButton.style.boxShadow = "0 10px 20px -8px rgba(0, 0, 0, 0.7)";
        };

        buttonDiv.appendChild(powerUpButton);
        topContainer.insertBefore(buttonDiv, topContainer.firstChild);
        //powerUpButton.onclick = showPromptAndInsertComment;

        const form = document.createElement("form");
        form.setAttribute ("id", "power-up-form");
        form.innerHTML = `
  <h3 id="power-up-h3">⚡ Power Up Details:</h3>
  <div id="template-format">
    <label for="template-select" class="template-format-label">Template: </label>
    <select id="template-select" class="template-format-input">
      <option value="please-select">Please Select a Template.</option>
      <option value="colo-rpp">Colo RPP</option>
      <option value="pdc">PDC</option>
      <option value="bus-way">Bus-Way</option>
      <option value="bus-way-rpp">Bus-Way with RPP</option>
    </select>
  </div>`;

        const circuitAndTPVRInputs = document.createElement("div");
        circuitAndTPVRInputs.innerHTML = `    <label for="cir-input" class="power-up-labels">Circuits: </label>
    <input type="text" name="cir-input" id="cir-input" placeholder="Separated With Space. Ex: 45 46" class="power-up-inputs">
    <br/>
    <label for="tpvr1-input" class="power-up-labels">CONTROLLER: </label>
    <input type="text" name="tpvr1-input" id="tpvr1-input" placeholder="Ex: example" value=${puffenba_lib.userAlias} class="power-up-inputs">
    <br/>
    <label for="tpvr2-input" class="power-up-labels">OPERATOR: </label>
    <input type="text" name="tpvr2-input" id="tpvr2-input" placeholder="Ex: example" class="power-up-inputs">
  </div>`;

        const coloRPP = document.createElement("div");
        coloRPP.classList.add("lineup-div");
        coloRPP.innerHTML = `<div id="power-up-inputs-div">
    <label for="block-input" class="power-up-labels">Lineup: </label>
    <input type="text" name="block-input" id="block-input" placeholder="Ex: A21" class="power-up-inputs">
    <br/>
    <label for="panel-input" class="power-up-labels">Panel: </label>
    <input type="text" name="panel-input" id="panel-input" placeholder="Ex: 01-02" class="power-up-inputs">
    <br/>
`;

        const pdc = document.createElement("div");
        pdc.classList.add("lineup-div");
        pdc.innerHTML = `<div id="pdc-inputs-div">
    <label for="block-input" class="power-up-labels">PDC: </label>
    <input type="text" name="block-input" id="block-input" placeholder="Ex: 2.1.A6" class="power-up-inputs">
    <br/>
    <label for="ats-input" class="power-up-labels">ATS Serial #: </label>
    <input type="text" name="ats-input" id="ats-input" placeholder="(Leave empty if not applicable)" class="power-up-inputs">
    <br/>
    <laber for="rackpos-input" class="power-up-label">RACK Postion: </label>
    <input type="text" name="rackpos-input" id="rackpos-input" placeholder="BKK61.1-1.01-01-021-50" class="power-up-inputs">
    <br/>


`;

        const busWay = document.createElement("div");
        busWay.classList.add("lineup-div");
        busWay.innerHTML = `<div id="busway-inputs-div">
    <label for="block-input" class="power-up-labels">Lineup: </label>
    <input type="text" name="block-input" id="block-input" placeholder="Ex: 10A3" class="power-up-inputs">
    <br/>
    <label for="catcher-input" class="power-up-labels">Catcher: </label>
    <input type="text" name="catcher-input" id="catcher-input" placeholder="Ex: C2-24" class="power-up-inputs">
    <br/>
    <label for="panel-input" class="power-up-labels">Tap Box: </label>
    <input type="text" name="panel-input" id="panel-input" placeholder="Ex: 08" class="power-up-inputs">
    <br/>
`;

        const busWayRpp = document.createElement("div");
        busWayRpp.classList.add("lineup-div");
        busWayRpp.innerHTML = `<div id="busway-inputs-div">
    <label for="block-input" class="power-up-labels">Lineup: </label>
    <input type="text" name="block-input" id="block-input" placeholder="Ex: 4A1-2" class="power-up-inputs">
    <br/>
    <label for="catcher-input" class="power-up-labels">Catcher: </label>
    <input type="text" name="catcher-input" id="catcher-input" placeholder="Ex: C1-17-2" class="power-up-inputs">
    <br/>
`;

        const testInputs = document.createElement("div");
        testInputs.innerHTML = `  <fieldset class="test-input-div">
    <span class="test-input-div">Voltage Check: </span>
    <input
      type="radio"
      id="voltage-successful"
      name="voltage-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="voltage-successful" class="test-input-label">Successful</label>
    <input type="radio" id="voltage-unsuccessful" name="voltage-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="voltage-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

   <fieldset class="test-input-div">
    <span class="test-input-div">DCO rep monitoring ATSPSU flip test: </span>
    <input
      type="radio"
      id="dcorep-successful"
      name="dcorep-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="dcorep-successful" class="test-input-label">Successful</label>
    <input type="radio" id="dcorep-unsuccessful" name="dcorep-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="dcorep-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">DCEO rep monitoring ATSPSU flip test: </span>
    <input
      type="radio"
      id="dceorep-successful"
      name="dceorep-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="dceorep-successful" class="test-input-label">Successful</label>
    <input type="radio" id="dceorep-unsuccessful" name="dceorep-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="dceorep-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">DCEO rep observing flip test: </span>
    <input
      type="radio"
      id="dceoobs-successful"
      name="dceoobs-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="dceoobs-successful" class="test-input-label">Successful</label>
    <input type="radio" id="dceoobs-unsuccessful" name="dceoobs-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="dceoobs-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">DCEO rep confirmed operative: </span>
    <input
      type="radio"
      id="dceocon-successful"
      name="dceocon-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="dceocon-successful" class="test-input-label">Successful</label>
    <input type="radio" id="dceocon-unsuccessful" name="dceocon-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="dceocon-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Were flip test performed successfully: </span>
    <input
      type="radio"
      id="fliptest-successful"
      name="fliptest-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="fliptest-successful" class="test-input-label">Successful</label>
    <input type="radio" id="fliptest-unsuccessful" name="fliptest-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="fliptest-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

    <fieldset class="test-input-div">
    <span class="test-input-div">Pre flip test: </span>
    <input
      type="radio"
      id="prefliptest-successful"
      name="prefliptest-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="prefliptest-successful" class="test-input-label">Successful</label>
    <input type="radio" id="prefliptest-unsuccessful" name="prefliptest-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="prefliptest-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Post flip test: </span>
    <input
      type="radio"
      id="posfliptest-successful"
      name="posfliptest-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="posfliptest-successful" class="test-input-label">Successful</label>
    <input type="radio" id="posfliptest-unsuccessful" name="posfliptest-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="posfliptest-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Rack feet down: </span>
    <input
      type="radio"
      id="rfd-successful"
      name="rfd-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="rfd-successful" class="test-input-label">Successful</label>
    <input type="radio" id="rfd-unsuccessful" name="rfd-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="rfd-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Air grill open: </span>
    <input
      type="radio"
      id="air-successful"
      name="air-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="air-successful" class="test-input-label">Successful</label>
    <input type="radio" id="air-unsuccessful" name="air-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="air-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Earth cable applied: </span>
    <input
      type="radio"
      id="earth-successful"
      name="earth-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="earth-successful" class="test-input-label">Successful</label>
    <input type="radio" id="earth-unsuccessful" name="earth-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="earth-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

    <fieldset class="test-input-div">
    <span class="test-input-div">Hot aisle containment removed: </span>
    <input
      type="radio"
      id="hot-successful"
      name="hot-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="hot-successful" class="test-input-label">Successful</label>
    <input type="radio" id="hot-unsuccessful" name="hot-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="hot-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Power circuit label on Power Shelf: </span>
    <input
      type="radio"
      id="cir1-successful"
      name="cir1-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="cir1-successful" class="test-input-label">Successful</label>
    <input type="radio" id="cir1-unsuccessful" name="cir1-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="cir1-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Power circuit label on cord behind plug: </span>
    <input
      type="radio"
      id="cir2-successful"
      name="cir2-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="cir2-successful" class="test-input-label">Successful</label>
    <input type="radio" id="cir2-unsuccessful" name="cir2-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="cir2-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Circuits plugged into rack match CF:B: </span>
    <input
      type="radio"
      id="cir3-successful"
      name="cir3-radio-options"
      value="Yes"
      class="test-input-class"
      checked />
    <label for="cir3-successful" class="test-input-label">Yes</label>
    <input type="radio" id="cir3-unsuccessful" name="cir3-radio-options" class="test-input-class" value="No" />
    <label for="cir3-unsuccessful" class="test-input-label">No</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Power on: </span>
    <input
      type="radio"
      id="pow-successful"
      name="pow-radio-options"
      value="Yes"
      class="test-input-class"
      checked />
    <label for="pow-successful" class="test-input-label">Yes</label>
    <input type="radio" id="pow-unsuccessful" name="pow-radio-options" class="test-input-class" value="No" />
    <label for="pow-unsuccessful" class="test-input-label">No</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Install completed: </span>
    <input
      type="radio"
      id="ins-successful"
      name="ins-radio-options"
      value="Yes"
      class="test-input-class"
      checked />
    <label for="ins-successful" class="test-input-label">Yes</label>
    <input type="radio" id="ins-unsuccessful" name="ins-radio-options" class="test-input-class" value="No" />
    <label for="ins-unsuccessful" class="test-input-label">No</label>
  </fieldset>


  <fieldset class="test-input-div">
    <span class="ats-input">Performed PSU-ATS Flip Test: </span>
    <input
      type="radio"
      id="ats-successful"
      name="ats-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="ats-successful" class="test-input-label">Successful</label>
    <input type="radio" id="ats-unsuccessful" name="ats-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="ats-unsuccessful" class="test-input-label">Unsuccessful</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Performed BBU-Battery Test: </span>
    <input
      type="radio"
      id="battery-successful"
      name="battery-radio-options"
      value="Successful"
      class="test-input-class"
      checked />
    <label for="battery-successful" class="test-input-label">Successful</label>
    <input type="radio" id="battery-unsuccessful" name="battery-radio-options" class="test-input-class" value="Unsuccessful" />
    <label for="battery-unsuccessful" class="test-input-label">Unsuccessful</label>
    <input type="radio" id="battery-na" name="battery-radio-options" class="test-input-class" value="N/A" />
    <label for="battery-na" class="test-input-label">N/A</label>
  </fieldset>

  <fieldset class="test-input-div">
    <span class="test-input-div">Hot Aisle Containment (HAC): </span>
    <input
      type="radio"
      id="removed"
      name="hac-radio-options"
      value="Removed"
      class="test-input-class"
      />
    <label for="removed" class="test-input-label">Removed</label>
    <input type="radio" id="na" name="hac-radio-options" class="test-input-class" value="N/A" checked />
    <label for="na" class="test-input-label">N/A</label>
  </fieldset>
</form>`;

        // Create Submit Button
        const addSubmitButtonInForm = document.createElement("button");
        addSubmitButtonInForm.setAttribute("id", "submit-button");
        addSubmitButtonInForm.innerHTML = "Submit";

        // Create Cancel Button
        const addCancelButtonInForm = document.createElement("button");
        addCancelButtonInForm.setAttribute("id", "cancel-button");
        addCancelButtonInForm.innerHTML = "Cancel";

        // Create Reset button
        const addResetButtonInForm = document.createElement("button");
        addResetButtonInForm.setAttribute("id", "reset-button");
        addResetButtonInForm.innerHTML = "Reset";

        const formStyle = document.createElement("style");
        formStyle.innerHTML = `

#button-div {
text-align: right;
margin: 1rem;
border: 2pt solid gray;
background-color: rgba(0, 0, 0, 0.15);
}

#power-up-form {
min-width: 456.6px;
}

#power-up-h3 {
text-align: center;
}

#template-format {
text-align: right;
}

.template-format-label {
margin-right: 1rem;
margin-left: 2rem;
height: 3rem;
}

.template-format-input {
width: 30rem;
height: 3rem;
margin-right: 3rem;
margin-bottom: 2rem;
text-align: center !important;
}

#power-up-inputs-div {
text-align: right;
}

#submit-button, #cancel-button, #reset-button {
width: 8rem;
height: 3.5rem;
margin: 1rem;
}

#submit-button {
background-color: rgb(48, 173, 86);
color: white;
}

#cancel-button {
background-color: rgba(209, 10, 10, 0.884);
color: white;
}

#reset-button {
position: absolute;
left: 20px;
margin: 1rem;
}

#submit-button:hover, #cancel-button:hover, #reset-button:hover {
background-color: black;
color: white;
}

.power-up-labels {
text-align: left !important;
margin-right: 1rem;
height: 3rem;

}

.power-up-inputs {
width: 30rem;
height: 3rem;
padding: 1rem;
margin-right: 3rem;
margin-bottom: 0.7rem;
}

#tpvr1-input, #tpvr2-input {
margin-bottom: 1rem;
}


.test-input-div {
text-align: left !important;
}


.test-input-class {
width: 1.8rem;
height: 1.8rem;
padding: 0.8rem;
margin-left: 1rem;

}


.test-input-label:hover, .test-input-class:hover {
cursor: pointer;
}


fieldset {
border: 1pt solid gray;
margin-bottom: 0.5rem;
}




`;




        powerUpButton.addEventListener("click", () => {

            count = 1;

            buttonDiv.innerHTML = "";
            buttonDiv.appendChild(form);
            buttonDiv.appendChild(formStyle);
            form.appendChild(addCancelButtonInForm);


            let templateName = localStorage.getItem("templateSelect");
            let templateSelect = document.getElementById("template-select");


            if (templateName == null || templateSelect == null || templateName === "please-select"){
                templateSelect.selectedIndex = 0;


            } else {
                templateSelect.value = templateName;
                // renderTemplate(templateName);

                form.insertBefore(addSubmitButtonInForm, addCancelButtonInForm);
                form.appendChild(addResetButtonInForm);
                form.insertBefore(testInputs, addSubmitButtonInForm);
                form.insertBefore(circuitAndTPVRInputs, testInputs);
                form.insertBefore(renderTemplate(templateName), circuitAndTPVRInputs);

                // Set tpvr2 wich is gonna be the verifier alias in the input feild
                let tpvr2 = document.querySelector("#tpvr2-input");
                if (tpvr2) {tpvr2.value = localStorage.getItem("tpvr2");}

                populateFormFromStorage();
                populateFormFromSession();

                // Function to listen to changes on form and saves the values to sessionStorage
                form.addEventListener (("change"), (event) => {
                    event.preventDefault();
                    saveFormDataToSession();
                    populateFormFromSession();
                });



            }

            let blockInput = document.querySelector("#block-input");
            blockInput && blockInput.focus();

            const scannerInputs = document.getElementById("ats-input");
            scannerInputs && scannerInputs.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                }
            });


            templateSelect.addEventListener("change", (event) => {
                event.preventDefault();
                let selectedOption = document.getElementById("template-select").value;
                let lineUp = renderTemplate(selectedOption);
                if (selectedOption == "please-select"){
                    renderTemplate("please-select");
                } else {
                    form.insertBefore(addSubmitButtonInForm, addCancelButtonInForm);
                    form.appendChild(addResetButtonInForm);
                    form.insertBefore(testInputs, addSubmitButtonInForm);
                    form.insertBefore(circuitAndTPVRInputs, testInputs);
                    form.insertBefore(lineUp, circuitAndTPVRInputs);
                    //renderTemplate(selectedOption);
                }
                let tpvr2 = document.querySelector("#tpvr2-input");
                if (tpvr2) {tpvr2.value = localStorage.getItem("tpvr2");}
                populateFormFromStorage();
                populateFormFromSession();
                let blockInput = document.querySelector("#block-input");
                blockInput && blockInput.focus();


                const scannerInputs = document.getElementById("ats-input");
                scannerInputs && scannerInputs.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                    }
                });

                // Save selected template to local storage
                localStorage.setItem("templateSelect", selectedOption);

                saveFormDataToSession();


            });




            // Cancel button will close the form and brings back the power up button.
            const cancelButton = document.querySelector("#cancel-button");
            cancelButton.addEventListener("click", (e) => {
                e.preventDefault();
                saveFormDataToSession();
                count = 0;
                topContainer.id = "";
                buttonDiv.remove();
                addPowerUpButton();
            });


            // Submit button will post the notes to ticket correspondence
            addSubmitButtonInForm.addEventListener("click", (e) => {
                e.preventDefault();
                saveFormDataToSession();
                saveFormData();
                count = 0;
                let blockInput = document.querySelector("#block-input");
                let panelInput = document.querySelector("#panel-input");
                if (panelInput == null) {
                    panelInput = "";
                }
                let catcherInput = document.querySelector("#catcher-input");
                if (catcherInput == null) {
                    catcherInput = "";
                }
                let atsInput = document.querySelector("#ats-input");
                if (atsInput == null) {
                    atsInput = "";
                }
                let rackposInput = document.querySelector("#rackpos-input");
                if (rackposInput == null) {
                    rackposInput = "";
                }
                let cirInput = document.querySelector("#cir-input");
                let tpvr1Input = document.querySelector("#tpvr1-input");
                let tpvr2Input = document.querySelector("#tpvr2-input");
                let atsOption = document.querySelector(`input[name="ats-radio-options"]:checked`);
                let batteryOption = document.querySelector(`input[name="battery-radio-options"]:checked`);
                let hacOption = document.querySelector(`input[name="hac-radio-options"]:checked`);
                let voltageOption = document.querySelector(`input[name="voltage-radio-options"]:checked`);
                let dcorepOption = document.querySelector(`input[name="dcorep-radio-options"]:checked`)
                let dceorepOption = document.querySelector(`input[name="dceorep-radio-options"]:checked`);
                let dceoobsOption = document.querySelector(`input[name="dceoobs-radio-options"]:checked`);
                let dceoconOption = document.querySelector(`input[name="dceocon-radio-options"]:checked`);
                let fliptestOption = document.querySelector(`input[name="fliptest-radio-options"]:checked`);
                let prefliptestOption = document.querySelector(`input[name="prefliptest-radio-options"]:checked`);
                let posfliptestOption = document.querySelector(`input[name="posfliptest-radio-options"]:checked`);
                let rfdOption = document.querySelector(`input[name="rfd-radio-options"]:checked`);
                let airOption = document.querySelector(`input[name="air-radio-options"]:checked`);
                let earthOption = document.querySelector(`input[name="earth-radio-options"]:checked`);
                let hotOption = document.querySelector(`input[name="hot-radio-options"]:checked`);
                let cir1Option = document.querySelector(`input[name="cir1-radio-options"]:checked`);
                let cir2Option = document.querySelector(`input[name="cir2-radio-options"]:checked`);
                let cir3Option = document.querySelector(`input[name="cir3-radio-options"]:checked`);
                let powOption = document.querySelector(`input[name="pow-radio-options"]:checked`);
                let insOption = document.querySelector(`input[name="ins-radio-options"]:checked`);
                //let rfdOption = document.querySelector(`input[name="rfd-radio-options":checked]`);
                //let psuOption = document.querySelector(`input[name="psu-radio-options":checked]`);

                let input1 = blockInput.value;
                let input2 = panelInput.value;
                let input3 = cirInput.value;
                let rackposValue = rackposInput.value;
                let catcherValue = catcherInput.value;
                let atsValue = atsInput.value;
                let tpvr1 = tpvr1Input.value;
                let tpvr2 = tpvr2Input.value;
                let atsOptionValue = atsOption.value;
                let batteryOptionValue = batteryOption.value;
                let hacOptionValue = hacOption.value;
                let voltageOptionValue = voltageOption.value;
                let dcorepOptionValue = dcorepOption.value;
                let dceorepOptionValue = dceorepOption.value;
                let dceoobsOptionValue = dceoobsOption.value;
                let dceoconOptionValue = dceoconOption.value;
                let fliptestOptionValue = fliptestOption.value;
                let prefliptestOptionValue = prefliptestOption.value;
                let posfliptestOptionValue = posfliptestOption.value;
                let rfdOptionValue = rfdOption.value;
                let airOptionValue = airOption.value;
                let earthOptionValue = earthOption.value;
                let hotOptionValue = hotOption.value;
                let cir1OptionValue = cir1Option.value;
                let cir2OptionValue = cir2Option.value;
                let cir3OptionValue = cir3Option.value;
                let powOptionValue = powOption.value;
                let insOptionValue = insOption.value;
                //let rfdOptionValue = rfdOption.value;

                //let psuOptionValue = psuOption.value;

                const infoObj = {
                    input1: input1,
                    input2: input2,
                    input3: input3,
                    catcherValue: catcherValue,
                    atsValue: atsValue,
                    rackposValue: rackposValue,
                    tpvr1: tpvr1,
                    tpvr2: tpvr2,
                    atsOptionValue: atsOptionValue,
                    batteryOptionValue: batteryOptionValue,
                    hacOptionValue: hacOptionValue,
                    voltageOptionValue: voltageOptionValue,
                    dcorepOptionValue: dcorepOptionValue,
                    dceorepOptionValue: dceorepOptionValue,
                    dceoobsOptionValue: dceoobsOptionValue,
                    dceoconOptionValue: dceoconOptionValue,
                    fliptestOptionValue: fliptestOptionValue,
                    prefliptestOptionValue: prefliptestOptionValue,
                    posfliptestOptionValue: posfliptestOptionValue,
                    rfdOptionValue: rfdOptionValue,
                    airOptionValue: airOptionValue,
                    earthOptionValue: earthOptionValue,
                    hotOptionValue: hotOptionValue,
                    cir1OptionValue: cir1OptionValue,
                    cir2OptionValue: cir2OptionValue,
                    cir3OptionValue: cir3OptionValue,
                    powOptionValue: powOptionValue,
                    insOptionValue: insOptionValue,
                    //rfdOptionValue: rfdOptionValue,
                    //psuOptionValue: psuOptionValue,

                };

                postNotes(infoObj);

                topContainer.id = "";
                buttonDiv.remove();
                addPowerUpButton();

            });

            addResetButtonInForm.addEventListener("click", (e) => {
                e.preventDefault();
                form.reset();
                templateSelect.value = localStorage.getItem("templateSelect");
                saveFormDataToSession();

            });

            let tpvr2 = document.querySelector("#tpvr2-input");
            if (tpvr2) {tpvr2.value = localStorage.getItem("tpvr2");}
            populateFormFromStorage();
            populateFormFromSession();
        });




        function renderTemplate (selectedOption) {
            let lineup = document.querySelector(".lineup-div");
            if (lineup) {
                lineup.remove();
                addSubmitButtonInForm.remove();
                testInputs.remove();
                circuitAndTPVRInputs.remove();
                addResetButtonInForm.remove();
            }

            if (selectedOption == "please-select"){
                // Assembling all form contents based on conditions
                buttonDiv.innerHTML = "";
                buttonDiv.appendChild(form);
                buttonDiv.appendChild(formStyle);
                form.appendChild(addCancelButtonInForm);
                return
            }

            if (selectedOption === "colo-rpp") {
                //buttonDiv.innerHTML = "";
                //buttonDiv.innerHTML = form + coloRPP + circuitAndTPVRInputs + testInputs + addSubmitButtonInForm + addCancelButtonInForm + formStyle;
                return coloRPP;

            }

            if (selectedOption === "pdc") {
                //buttonDiv.innerHTML = "";
                // buttonDiv.innerHTML = form + pdc + circuitAndTPVRInputs + testInputs + addSubmitButtonInForm + addCancelButtonInForm + formStyle;
                return pdc;
            }

            if (selectedOption === "bus-way") {
                return busWay;
            }

            if (selectedOption === "bus-way-rpp") {
                return busWayRpp
            }




        }

    }



    function postNotes(infoObj) {
        let selectedOption = document.getElementById("template-select").value;
        localStorage.setItem("templateSelect", selectedOption);

        let textArea = "";

        // Split circuit input into an array of circuits
        let circuitInputs = infoObj.input3.split(" ");
        // Removes the extra space
        let circuits = circuitInputs.filter((index) => index != "");
        let circuitList = circuits.join(" & ");

        // Used localstorage to store the verifier alias
        localStorage.setItem("tpvr2", infoObj.tpvr2);
        let tpvr2 = localStorage.getItem("tpvr2");

        // Check if the ATS and battery test was successful
        let successOption = "COMPLETED";
        if (infoObj.atsOptionValue === "Unsuccessful" || infoObj.batteryOptionValue === "Unsuccessful" || infoObj.voltageOptionValue === "Unsuccessful") {
            successOption = "NOT COMPLETE";
        }

        let circuitText = "";

        // If COLO RPP is selected
        if (selectedOption === "colo-rpp") {
            // Content for Colo-RPP option
            let block = infoObj.input1.toUpperCase();
            let source1;
            let source2;

            // Check for user input if Block ends in 21/22, or 11/12
            if (block.endsWith("21") || block.endsWith("22")) {
                source1 = "R21";
                source2 = "R22";
            } else if (block.endsWith("11") || block.endsWith("12")) {
                source1 = "R11";
                source2 = "R12";
            }


            circuitText += `RPP - ${block} - ${source1} - ${infoObj.input2} - CIRCUIT ${circuitList}\n`;
            circuitText += `RPP - ${block} - ${source2} - ${infoObj.input2} - CIRCUIT ${circuitList}\n`;

            textArea = `${circuitText}
Voltage Check: ${infoObj.voltageOptionValue}
Performed PSU-ATS flip test: ${infoObj.atsOptionValue}
Performed BBU-Battery test: ${infoObj.batteryOptionValue}
Power Up: ${successOption}
HAC: ${infoObj.hacOptionValue}

TPVR 1: https://phonetool.amazon.com/users/${infoObj.tpvr1}
TPVR 2: https://phonetool.amazon.com/users/${infoObj.tpvr2}
`;

            // If PDC is selected
        } else if (selectedOption === "pdc") {


            circuitText += `RACK POSITION:${infoObj.rackposValue.toUpperCase()}\n\n`;
            circuitText += `Primary Source 1 (Lower)\n`;
            circuitText += `PDC Name: PDC-${infoObj.input1.toUpperCase()}\n`;
            circuitText += `PDP Breaker No: PDC-${infoObj.input1.toUpperCase()}/MCB${circuitList}P\n\n`;



            circuitText += `Catcher Source 1 (Lower)\n`;
            circuitText += `PDC Name: PDC-${infoObj.input1.toUpperCase()}\n`;
            circuitText += `PDP Breaker No: PDC-${infoObj.input1.toUpperCase()}/MCB${circuitList}C\n\n`;

            circuitText += `ATSPSU and Rack Checks\n`;
            circuitText += `DCO rep monitoring ATSPSU flip test:${infoObj.dcorepOptionValue}\n`;
            circuitText += `DCEO rep monitoring ATSPSU flip test:${infoObj.dceorepOptionValue}\n`;
            circuitText += `DCEO rep observing flip test:${infoObj.dceoobsOptionValue}\n`;
            circuitText += `DCEO rep confirmed operative:${infoObj.dceoconOptionValue}\n`;
            circuitText += `DCEO Q and A:\n`;
            circuitText += `Were flip tests performed successfully:${infoObj.fliptestOptionValue}\n`;
            circuitText += `Did racks remain stable before, during and after ATS testing:${infoObj.atsOptionValue}\n`;
            circuitText += `Pre flip test, did all servers on the rack have power:${infoObj.prefliptestOptionValue}\n`;
            circuitText += `Post flip test, did all servers on the rack have power:${infoObj.posfliptestOptionValue}\n\n`;

            circuitText += `Rack feet down:${infoObj.rfdOptionValue}\n`;
            circuitText += `Air grill open:${infoObj.airOptionValue}\n`;
            circuitText += `Earth cable applied:${infoObj.earthOptionValue}\n`;
            circuitText += `Hot aisel containment removed:${infoObj.hotOptionValue}\n`;
            circuitText += `Power circuit label on Power Shelf:${infoObj.cir1OptionValue}\n`;
            circuitText += `Power circuit label on cord behind plug:${infoObj.cir2OptionValue}\n`;
            circuitText += `Verification that circuits plugged into rack match CloudForge:${infoObj.cir3OptionValue}\n`;
            circuitText += `Power on:${infoObj.powOptionValue}\n`;
            circuitText += `Install completed:${infoObj.insOptionValue}\n`;


            // Check if atsValue exists and is not empty
            if (infoObj.atsValue !== "") {
                circuitText += `ATS Serial#: ${infoObj.atsValue.toUpperCase()}
`;
            }

            textArea = `${circuitText}

CONTROLLER: https://phonetool.amazon.com/users/${infoObj.tpvr1}
OPERATOR: https://phonetool.amazon.com/users/${infoObj.tpvr2}
`;

            // if Bus-Way is selected
        } else if (selectedOption === "bus-way") {
            circuitText += `BW - ${infoObj.input1.toUpperCase()} - TB-${infoObj.input2} - CIRCUIT ${circuitList}
BW - ${infoObj.catcherValue.toUpperCase()} - TB-${infoObj.input2} - CIRCUIT ${circuitList}
`;

            textArea = `${circuitText}
Voltage Check: ${infoObj.voltageOptionValue}
Performed PSU-ATS flip test: ${infoObj.atsOptionValue}
Performed BBU-Battery test: ${infoObj.batteryOptionValue}
Power Up: ${successOption}
HAC: ${infoObj.hacOptionValue}

TPVR 1: https://phonetool.amazon.com/users/${infoObj.tpvr1}
TPVR 2: https://phonetool.amazon.com/users/${infoObj.tpvr2}
`;

            // If Bus-Way with RPP is selected
        } else if (selectedOption === "bus-way-rpp") {
            circuitText += `RPP - ${infoObj.input1.toUpperCase()} - CIRCUIT ${circuitList}
RPP - ${infoObj.catcherValue.toUpperCase()} - CIRCUIT ${circuitList}
`;
            textArea = `${circuitText}
Voltage Check: ${infoObj.voltageOptionValue}
Performed PSU-ATS flip test: ${infoObj.atsOptionValue}
Performed BBUBattery test: ${infoObj.batteryOptionValue}
Power Up: ${successOption}
HAC: ${infoObj.hacOptionValue}

TPVR 1: https://phonetool.amazon.com/users/${infoObj.tpvr1}
TPVR 2: https://phonetool.amazon.com/users/${infoObj.tpvr2}
`;
        }

        // Alert the user if they selected unsuccessful option for voltage, ats or BBU tests.
        // Initialize an array to hold the names of unsuccessful options
        const unsuccessfulOptions = [];
        // Check each option and add the names of unsuccessful options to the array
        if (infoObj.voltageOptionValue === "Unsuccessful") {
            unsuccessfulOptions.push("Voltage Check");
        }
        if (infoObj.atsOptionValue === "Unsuccessful") {
            unsuccessfulOptions.push("PSU-ATS Flip Test");
        }
        if (infoObj.batteryOptionValue === "Unsuccessful") {
            unsuccessfulOptions.push("BBU-Battery Test");
        }
        // Check if there are any unsuccessful options before generating the alert
        if (unsuccessfulOptions.length > 0) {
            // Construct the alert message based on the number of unsuccessful options
            if (unsuccessfulOptions.length === 1) {
                alert(`You have selected "Unsuccessful" option for ${unsuccessfulOptions[0]}. Please provide a justification in the ticket correspondence.\nPower up is not complete.`);
            } else {
                const unsuccessfulOptionsString = unsuccessfulOptions.join(", ");
                alert(`You have selected "Unsuccessful" options for ${unsuccessfulOptionsString}. Please provide justifications in the ticket correspondence.\nPower up is not complete.`);
            }
        }


        // Sending notes to correspondence box
        insertComment(textArea);
    }



    // Event listener to trigger the comment insertion when (Ctrl + .) is pressed
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === ".") {
            showPromptAndInsertComment();
        }
    });

    // Call addPowerUpButton once to add the button initially
    addPowerUpButton();
})();