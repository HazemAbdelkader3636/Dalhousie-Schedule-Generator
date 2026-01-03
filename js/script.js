/* 
    @author: Hazem Abdelkader
    @description: This program generates schedules for Dalhousie based 
    off of inputs from the user. This program prevents overlapping times
    meaning it doesn't account for schedules that have conflicts
*/

document.getElementById("generateBtn").addEventListener("click", function(e) {
    e.preventDefault();

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

// Splits up the classes into lectures and links
    winterData.forEach(element => {
        updateClass(classes, element);
    });

    deleteClasses(classes);

    console.log(classes.classOne);

    
    //Finding all combos of link + lectures  you can have (contains overlap)
    let combos = []; 
    for (let key in classes) {
    combos.push(scheduleCombo(classes[key]));
    }

    console.log(combos); 
    

    //Gets rid of all combos that don't have valid lecture + lab code
    combos.forEach(item => {
        item.forEach(element => {
             if ((element.tut && !sameCourseSet(element.lec, element.tut)) ||
                 (element.lab && !sameCourseSet(element.lec, element.lab))
                ) {
                    element.invalid = true;
            }
        })
    })
   
    //Remove all combos that have an invalid code
    combos = combos.map(item => item.filter(element => !element.invalid));
    combos.sort((a,b) => a.length - b.length);


    // let names = [];
    // let index = 0; 
    // for (let key in classes) {
    //     names[index] = classes[key].name;
    //     names[index] += classes[key].num;
    //     index++;
    // }

    //     index = 0; 

    // combos.forEach(item => {
    //     console.log(names[index]);
    //     for (let element of item) {
    //         console.log(element);
    //     }
    //     index++;
    // }) 

    const allSchedules = permute(combos);


    const validSchedules = [];

    for (let possibilty of allSchedules) {

        let sections = [];
        let hasConflict = false;

        for (let course of possibilty) {
            sections.push(course.lec);

            if (course.lab) {sections.push(course.lab); }
            if (course.tut) {sections.push(course.tut); }

            // Stops Snycronous courses from entering course, can be deleted 
            if ((course.lec && course.lec.TIMES === "C/D") ||
                (course.lab && course.lab.TIMES === "C/D") ||
                (course.tut && course.tut.TIMES === "C/D")) {
                 hasConflict = true;
                 break;
        }


        }

        let sectionLength = sections.length;

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


// Select container to append to
const container = document.createElement("div");
document.body.appendChild(container);

// Loop through each schedule
validSchedules.forEach((schedule, scheduleIndex) => {
    // Add a heading for the schedule
    const heading = document.createElement("h3");
    heading.textContent = `Schedule #${scheduleIndex + 1}`;
    container.appendChild(heading);

    // Loop through each course in the schedule
    schedule.forEach(course => {
        // Lecture
        let lecDays = appendDays(course.lec);
        let tutDays = appendDays(course.tut); 
        let labDays = appendDays(course.lab); 
        
        const lecItem = document.createElement("p");
        lecItem.textContent = `Lecture: ${course.lec.SUBJ_CODE} ${course.lec.CRSE_NUMB} - ${course.lec.TIMES}:  ${lecDays} `;
        container.appendChild(lecItem);

        // Link, if it exists
        if (course.tut) {
            const tutItem = document.createElement("p");
            tutItem.textContent = `Tut: ${course.tut.SUBJ_CODE} ${course.tut.CRSE_NUMB} - ${course.tut.TIMES}:  ${tutDays}`;
            container.appendChild(tutItem);
        }

        if (course.lab) {
            const labItem = document.createElement("p");
            labItem.textContent = `Lab: ${course.lab.SUBJ_CODE} ${course.lab.CRSE_NUMB} - ${course.lab.TIMES}:  ${labDays}`;
            container.appendChild(labItem);
        }

    });

    // Optional: add a separator
    const hr = document.createElement("hr");
    container.appendChild(hr);
});

})



/*

*/