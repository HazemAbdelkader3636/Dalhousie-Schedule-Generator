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
        link: [],
        hasLink: false
    },
    classTwo: {
        name: classTwoTitle,
        num: classTwoNumber,
        lec: [],
        link: [],
        hasLink: false
    },
    classThree: {
        name: classThreeTitle,
        num: classThreeNumber,
        lec: [],
        link: [],
        hasLink: false
    },
    classFour: {
        name: classFourTitle,
        num: classFourNumber,
        lec: [],
        link: [],
        hasLink: false
    },
    classFive: {
        name: classFiveTitle,
        num: classFiveNumber,
        lec: [],
        link: [],
        hasLink: false
    },
    classSix: {
        name: classSixTitle,
        num: classSixNumber,
        lec: [],
        link: [],
        hasLink: false
    }
};

// Splits up the classes into lectures and links
    winterData.forEach(element => {
        if ((element.SUBJ_CODE == classOneTitle) && (element.CRSE_NUMB.trim() == classOneNumber)) {
            if (element.SCHD_TYPE == "Lec") {
                classes.classOne.lec.push(element);
            } else {
                classes.classOne.hasLink = true;
                classes.classOne.link.push(element);
            }
        }
        if ((element.SUBJ_CODE == classTwoTitle) && (element.CRSE_NUMB.trim() == classTwoNumber)) {
            if (element.SCHD_TYPE == "Lec") {
                classes.classTwo.lec.push(element);
            } else {
                classes.classTwo.hasLink = true;
                classes.classTwo.link.push(element);
            }
        }
        if ((element.SUBJ_CODE == classThreeTitle) && (element.CRSE_NUMB.trim() == classThreeNumber)) {
            if (element.SCHD_TYPE == "Lec") {
                classes.classThree.lec.push(element);
            } else {
                classes.classThree.hasLink = true;
                classes.classThree.link.push(element);
            }
        }
        if ((element.SUBJ_CODE == classFourTitle) && (element.CRSE_NUMB.trim() == classFourNumber)) {
            if (element.SCHD_TYPE == "Lec") {
                classes.classFour.lec.push(element);
            } else {
                classes.classFour.hasLink = true;
                classes.classFour.link.push(element);
            }
        }
        if ((element.SUBJ_CODE == classFiveTitle) && (element.CRSE_NUMB.trim() == classFiveNumber)) {
            if (element.SCHD_TYPE == "Lec") {
                classes.classFive.lec.push(element);
            } else {
                classes.classFive.hasLink = true;
                classes.classFive.link.push(element);
            }
        }
        if ((element.SUBJ_CODE == classSixTitle) && (element.CRSE_NUMB.trim() == classSixNumber)) {
            if (element.SCHD_TYPE == "Lec") {
                classes.classSix.lec.push(element);
            } else {
                classes.classSix.hasLink = true;
                classes.classSix.link.push(element);
            }
        } 
    });

     if (classOneTitle == "") {
        delete classes.classOne;
    }
     if (classTwoTitle == "") {
        delete classes.classTwo;
    }
     if (classThreeTitle == "") {
        delete classes.classThree;
    }
    if (classFourTitle == "") {
        delete classes.classFour;
    }
    if (classFiveTitle == "") {
        delete classes.classFive;
    }
    if (classSixTitle == "") {
        delete classes.classSix;
    }

    //Finding all combos of lab + lectures you can have (contains overlap)
    let combos = []; 
    for (let key in classes) {
    combos.push(scheduleCombo(classes[key]));
    }
    
    //Gets rid of all the combos that have a lecture and link conflicting
    combos.forEach(item => {
    item.forEach(element => {
        if (element.link && linkOverlap (
            parseInt(element.lec.TIMES.substring(0,4)),
            parseInt(element.lec.TIMES.substring(5,9)),
            parseInt(element.link.TIMES.substring(0,4)),
            parseInt(element.link.TIMES.substring(5,9))
            ) && sameDay(element.lec, element.link)) {
            element.invalid = true;
            }
        });
    });

    //Gets rid of all combos that don't have valid lecture + lab code
    let randomcount = 0; 
    combos.forEach(item => {
        item.forEach(element => {
            randomcount++;
            if (!sameCourseSet(element.lec, element.link)) {
                element.invalid = true; 
            }
        })
    })

    //Remove all combos that have an invalid feature
    combos = combos.map(item => item.filter(element => !element.invalid));
    combos.sort((a,b) => a.length - b.length);

    let names = [];
    let index = 0; 

    for (let key in classes) {
        names[index] = classes[key].name;
        names[index] += classes[key].num;
        index++;
    }

        index = 0; 

    combos.forEach(item => {
        console.log(names[index]);
        for (let element of item) {
            console.log(element);
        }
        index++;
    }) 

    const allSchedules = permute(combos);


    const validSchedules = [];

    for (let possibilty of allSchedules) {

        let sections = [];

        for (let course of possibilty) {
            sections.push(course.lec);
            sections.push(course.link);
        }

        let sectionLength = sections.length;
        let hasConflict = false; 

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
        let linkDays = appendDays(course.link); 
        
        const lecItem = document.createElement("p");
        lecItem.textContent = `Lecture: ${course.lec.SUBJ_CODE} ${course.lec.CRSE_NUMB} - ${course.lec.TIMES}:  ${lecDays} `;
        container.appendChild(lecItem);

        // Link, if it exists
        if (course.link) {
            const linkItem = document.createElement("p");
            linkItem.textContent = `Link: ${course.link.SUBJ_CODE} ${course.link.CRSE_NUMB} - ${course.link.TIMES}:  ${linkDays}`;
            container.appendChild(linkItem);
        }
    });

    // Optional: add a separator
    const hr = document.createElement("hr");
    container.appendChild(hr);
});

})



/*

*/