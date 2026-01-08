/* 
    @author: Hazem Abdelkader
    @description: This program generates schedules for Dalhousie based 
    off of inputs from the user. This program prevents overlapping times
    meaning it doesn't account for schedules that have conflicts
*/

document.getElementById("generateBtn").addEventListener("click", function(e) {
    e.preventDefault();

    let scheduleDisplay = document.getElementById("schedules"); 
    scheduleDisplay.innerHTML = "";

    let classOneTitle = document.getElementById("input1").value.toUpperCase().trim();
    let classTwoTitle = document.getElementById("input2").value.toUpperCase().trim();
    let classThreeTitle = document.getElementById("input3").value.toUpperCase().trim();
    let classFourTitle = document.getElementById("input4").value.toUpperCase().trim();
    let classFiveTitle = document.getElementById("input5").value.toUpperCase().trim();
    let classSixTitle = document.getElementById("input6").value.toUpperCase().trim();

    let classOneNumber = document.getElementById("number1").value.trim()
    let classTwoNumber = document.getElementById("number2").value.trim()
    let classThreeNumber = document.getElementById("number3").value.trim()
    let classFourNumber = document.getElementById("number4").value.trim()
    let classFiveNumber = document.getElementById("number5").value.trim()
    let classSixNumber = document.getElementById("number6").value.trim()

    let termType = document.getElementById("term")
    let data;
    if (termType.value == "fall") { 
        data = fallData;
    } else {
        data = winterData; 
    }

    let classes = {
        classOne: {
            name: classOneTitle,
            num: classOneNumber,
            lec: [],
            tut: [],
            lab: [],
            hasLink: false
        },
        classTwo: {
            name: classTwoTitle,
            num: classTwoNumber,
            lec: [],
            tut: [],
            lab: [],
            hasLink: false
        },
        classThree: {
            name: classThreeTitle,
            num: classThreeNumber,
            lec: [],
            tut: [],
            lab: [],
            hasLink: false
        },
        classFour: {
            name: classFourTitle,
            num: classFourNumber,
            lec: [],
            tut: [],
            lab: [],
            hasLink: false
        },
        classFive: {
            name: classFiveTitle,
            num: classFiveNumber,
            lec: [],
            tut: [],
            lab: [],
            hasLink: false
        },
        classSix: {
            name: classSixTitle,
            num: classSixNumber,
            lec: [],
            tut: [],
            lab: [],
            hasLink: false
        }
    };


    // Places all courses into its corresponding object by going through each object in data
    data.forEach(element => {
        updateClass(classes, element);
    });

    //Remove courses that user leaves blank
    deleteClasses(classes);

    //Finding all combonations of link + lectures you can have for each individual class
    let combos = []; 
    for (let key in classes) {
        combos.push(scheduleCombo(classes[key]));
    }

    //Gets rid of all combos that don't have the same lecture and link code
    //Ex. B01 != L02 set to invalid,  B01 == L01 set to valid
    combos.forEach(item => {
        item.forEach(element => {
             if ((element.tut && !sameCourseSet(element.lec, element.tut)) ||
                 (element.lab && !sameCourseSet(element.lec, element.lab))
                ) {
                    element.invalid = true;
                    console.log("IT HAPPENED");
            }
        })
    })

   
    // Remove all combos that have invalid set as true 
    let clean = []; 

    combos.forEach(item => {

        let valid = []; 
        console.log(item);
        item.forEach(element => {
            if (!element.invalid) {
                valid.push(element);
            }
        })

        clean.push(valid); 
    })
    combos = clean; 

    // This includes all schedules even with time conflicts
    const allSchedules = permute(combos);

    const validSchedules = [];

    // Push all schedules that don't have any time conflicts into validSchedules
    for (let possibilty of allSchedules) {

        let sections = [];
        let hasConflict = false;

        for (let course of possibilty) {
            sections.push(course.lec);

            if (course.lab) {sections.push(course.lab); }
            if (course.tut) {sections.push(course.tut); }

            // Stops Snycronous courses from entering course (Can be deleted if needed)
            if ((course.lec && course.lec.TIMES === "C/D") ||
                (course.lab && course.lab.TIMES === "C/D") ||
                (course.tut && course.tut.TIMES === "C/D")) {
                 hasConflict = true;
                 break;
        }
        }

        let sectionLength = sections.length;

        // Only push section array if the array has no time conflicts between each element
        for (let i = 0; i < sectionLength && !hasConflict; i++) {
            for (let j = i + 1; j < sectionLength; j++) {
                if (timeOverlap(sections[i], sections[j])
                    && sameDay(sections[i], sections[j])) {
                hasConflict = true;
                break;
                } 
            }
        }


        if (!hasConflict) {
            validSchedules.push(possibilty); 
        }
    }

    console.log(validSchedules);



    const container = document.createElement("div");
    scheduleDisplay.appendChild(container);

    // Loop through each schedule
    validSchedules.forEach((schedule, scheduleIndex) => {

        // Add a heading for the schedule
        const heading = document.createElement("h3");
        heading.textContent = `Schedule #${scheduleIndex + 1}`;
        container.appendChild(heading);

        // Loop through each course in the schedule
        schedule.forEach(course => {
            let lecDays = appendDays(course.lec);
            let tutDays = appendDays(course.tut); 
            let labDays = appendDays(course.lab); 
            
            const lecItem = document.createElement("p");
            lecItem.textContent = `Lecture: ${course.lec.SUBJ_CODE} ${course.lec.CRSE_NUMB} - ${course.lec.TIMES}:  ${lecDays} `;
            container.appendChild(lecItem);

            // Output Tut, if it exists
            if (course.tut) {
                const tutItem = document.createElement("p");
                tutItem.textContent = `Tut: ${course.tut.SUBJ_CODE} ${course.tut.CRSE_NUMB} - ${course.tut.TIMES}:  ${tutDays}`;
                container.appendChild(tutItem);
            }

            // Output Lab, if it exists
            if (course.lab) {
                const labItem = document.createElement("p");
                labItem.textContent = `Lab: ${course.lab.SUBJ_CODE} ${course.lab.CRSE_NUMB} - ${course.lab.TIMES}:  ${labDays}`;
                container.appendChild(labItem);
            }

        });

        const hr = document.createElement("hr");
        container.appendChild(hr);
    });

})



/*

*/