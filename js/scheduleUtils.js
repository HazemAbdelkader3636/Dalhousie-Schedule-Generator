/* 
    @description: This function is used to find whether or 
        not classes have a time overlap
    @param: startTime1 is what time the first class starts
    @param: endTime1 is what time the first class ends
    @param: startTime2 is what time the second class starts
    @param: endTime2 is what time the second class ends
    @return: returns wether or not the classes has a time overlap
*/
function linkOverlap(startTime1, endTime1, startTime2, endTime2) {
    return startTime1 < endTime2 && startTime2 < endTime1;
}

function timeOverlap(firstClass, secondClass) {

    if (!firstClass || !secondClass) {
        return false;
    }

    let start1 = parseInt(firstClass.TIMES.substring(0,4));
    let end1   = parseInt(firstClass.TIMES.substring(5,9));
    let start2 = parseInt(secondClass.TIMES.substring(0,4));
    let end2   = parseInt(secondClass.TIMES.substring(5,9));

    return start1 < end2 && start2 < end1;
}

/*
    @description: uses backtracking to find every permutation of a schedule
        whilst mainting the order of the elements. Each permutation reperesents 
        a schedule that could be made, and can have time conflicts
    @param:


*/
function permute(combos) {
    let result = [];

    backtrack([], 0, combos, result);
    return result;
}

/*


*/
function backtrack(combination, index, combos, result)  {
  if (combination.length === combos.length) {
    result.push(Array.from(combination));
  }
  else {
    const currentSlot = combos[index];
    for (let item of currentSlot) {
    combination.push(item);
    backtrack(combination, index + 1, combos, result);
    combination.pop(); 
     }
    }
}


/*
    @description: This function is used to see wether or not the lecture 
        and the link for the lecture are in the same day. This is used to 
        make the lecture and link combonations for the schedules.
    @param: lec is an object of the course that is specifically a lecture
    @param: link is an object of the course that is specifically a tutorial or lab
    @return: returns wether or not the lecture and the link are on the same day
*/
function sameDay(lec, link) { 
    if (!lec || !link) return false;

    if ((lec.MONDAYS == "M" && link.MONDAYS == "M")
    || (lec.TUESDAYS == "T" && link.TUESDAYS == "T")
    || (lec.WEDNESDAYS == "W" && link.WEDNESDAYS == "W")
    || (lec.THURSDAYS == "R" && link.THURSDAYS == "R")
    || (lec.FRIDAYS == "F" && link.FRIDAYS == "F")
    ){
        return true;
    } 
    return false;
}

/*
    @description: This function checks if the lecture and the link are apart of the same class, it
        does this by checking if the SEQ_NUMB is the same of each.
    @param: lecture, this is the lecture course getting compared
    @param: link, this is the link course getting compared
    @return: true if they are the same SEQ_NUMB, false if they are not
*/
function sameCourseSet(lec, link) { 
    if (!link) {
        return true; 
    }
    if (lec.LINK_CONN == null && link.LINK_CONN == null) {
        return true; 
     }

    /*
    * LINK_CONN format : B01 | L01 
    * Extract only last character in string and compare
    */
    let lecLength = lec.LINK_CONN.length;
    let linkLength = link.LINK_CONN.length;

    let lecSubstring = lec.LINK_CONN.substring(lecLength - 1, lecLength);
    let linkSubstring = link.LINK_CONN.substring(linkLength - 1, linkLength);

    if (lecSubstring == linkSubstring) {
        return true;
    }

    return false;
}

/*
    @description: This function is used to make all the possible combinations 
        with the lecture and the link corresponding to that lecture
    @param: classes is the object that includes all the courses the user inputed
    @return: returns an array of all the combos of lectures and links for that course

*/
function scheduleCombo(classes) {
    let combos = [];

    classes.lec.forEach(lec => {

    // lecture only 
    if (!classes.hasLink) {
        combos.push({lec}); 
    }

    // lecture + tutorial
    if (classes.tut.length > 0 && classes.lab.length == 0) {
        classes.tut.forEach(tut => {
            combos.push({ lec, tut });
        })
    }

    // lecture + lab
    if (classes.lab.length > 0 && classes.tut.length == 0) {
        classes.lab.forEach(lab => {
            combos.push({ lec, lab });
        })
    }

    // lecture + lab + tutorial
    if (classes.lab.length > 0 && classes.tut.length > 0) {
        classes.tut.forEach(tut => {
            classes.lab.forEach(lab => {
                combos.push({lec, tut, lab});
            });
         });
    }
    });


    return combos;
}

function appendDays(course) {
    if (!course) {
        return "";
    }
    let res = "";
    if (course.MONDAYS == "M") {
        res += "M "
    }
    if (course.TUESDAYS == "T") {
        res += "T "
    }
    if (course.WEDNESDAYS == "W" ) {
        res += "W "
    }
    if (course.THURSDAYS == "R") {
        res += "TH "
    }
    if (course.FRIDAYS == "F" ) {
        res += "F "
    }
    return res; 
}

/*
    @description: Removes the course from the object "classes" if the user leaves the
        input field blank
    @param: classes is the object that holds the course name and course number that is 
        determined from the input fields
    
*/

function deleteClasses(classes) {
     if (classes.classOne.name == "") {
        delete classes.classOne;
    }
     if (classes.classTwo.name == "") {
        delete classes.classTwo;
    }
     if (classes.classThree.name == "") {
        delete classes.classThree;
    }
    if (classes.classFour.name == "") {
        delete classes.classFour;
    }
    if (classes.classFive.name == "") {
        delete classes.classFive;
    }
    if (classes.classSix.name == "") {
        delete classes.classSix;
    }
}


/*
    @description: If the course name and course number allign with the academic timetable data, append the
        lecture, and optional link to the certain individual course object in classes. classOne, is the first
        input field the user can fill, classTwo is the second, and so forth. 
    @param: classes, is the object that holds the course name, and course number from the input field. It will be updated
        with lectures and links if applicable in this function
    @param: element, this is an object in either winterData or fallData (depending on term input).
*/
function updateClass(classes, element) { 
    if ((element.SUBJ_CODE == classes.classOne.name) && (element.CRSE_NUMB.trim() == classes.classOne.num)) {
           switch(element.SCHD_TYPE) {
            case "Lec" :
                classes.classOne.lec.push(element);
                break;
            case "Tut" :
                classes.classOne.tut.push(element);
                classes.classOne.hasLink = true; 
                break;
            case "Lab" :
                classes.classOne.lab.push(element);
                classes.classOne.hasLink = true; 
                break;
           }
        }

        if ((element.SUBJ_CODE == classes.classTwo.name) && (element.CRSE_NUMB.trim() == classes.classTwo.num)) {
           switch(element.SCHD_TYPE) {
            case "Lec" :
                classes.classTwo.lec.push(element);
                break;
            case "Tut" :
                classes.classTwo.tut.push(element);
                classes.classTwo.hasLink = true; 
                break;
            case "Lab" :
                classes.classTwo.lab.push(element); 
                classes.classTwo.hasLink = true;
                break;
           }
        }

        if ((element.SUBJ_CODE == classes.classThree.name) && (element.CRSE_NUMB.trim() == classes.classThree.num)) {
           switch(element.SCHD_TYPE) {
            case "Lec" :
                classes.classThree.lec.push(element);
                break;
            case "Tut" :
                classes.classThree.tut.push(element);
                classes.classThree.hasLink = true; 
                break;
            case "Lab" :
                classes.classThree.lab.push(element); 
                classes.classThree.hasLink = true;
                break;
           }
        }

        if ((element.SUBJ_CODE == classes.classFour.name) && (element.CRSE_NUMB.trim() == classes.classFour.num)) {
           switch(element.SCHD_TYPE) {
            case "Lec" :
                classes.classFour.lec.push(element);
                break;
            case "Tut" :
                classes.classFour.tut.push(element); 
                classes.classFour.hasLink = true;
                break;
            case "Lab" :
                classes.classFour.lab.push(element); 
                classes.classFour.hasLink = true;
                break;
           }
        }

        if ((element.SUBJ_CODE == classes.classFive.name) && (element.CRSE_NUMB.trim() == classes.classFive.num)) {
           switch(element.SCHD_TYPE) {
            case "Lec" :
                classes.classFive.lec.push(element);
                break;
            case "Tut" :
                classes.classFive.tut.push(element); 
                classes.classFive.hasLink = true;
                break;
            case "Lab" :
                classes.classFive.lab.push(element); 
                classes.classFive.hasLink = true;
                break;
           }
        }

        if ((element.SUBJ_CODE == classes.classSix.name) && (element.CRSE_NUMB.trim() == classes.classSix.num)) {
           switch(element.SCHD_TYPE) {
            case "Lec" :
                classes.classSix.lec.push(element);
                break;
            case "Tut" :
                classes.classSix.tut.push(element); 
                classes.classSix.hasLink = true;
                break;
            case "Lab" :
                classes.classSix.lab.push(element);
                classes.classSix.hasLink = true; 
                break;
           }
        }
}

function MakeSchedule(validSchedules) {

    const days = {
        MONDAYS: 1,
        TUESDAYS: 2,
        WEDNESDAYS: 3,
        THURSDAYS: 4,
        FRIDAYS: 5
    };

    let finalSchedules = [];
   

    validSchedules.forEach((schedule) => {
        
        let scheduleTable = [
            ["0835-0925", "", "", "", "", ""],
            ["0835-0955", "", "", "", "", ""],
            ["0935-1025", "", "", "", "", ""],
            ["1005-1125", "", "", "", "", ""],
            ["1035-1125", "", "", "", "", ""],
            ["1135-1225", "", "", "", "", ""],
            ["1135-1255", "", "", "", "", ""],
            ["1205-1255", "", "", "", "", ""],
            ["1235-1325", "", "", "", "", ""],        
            ["1305-1425", "", "", "", "", ""],
            ["1335-1425", "", "", "", "", ""],
            ["1435-1525", "", "", "", "", ""],
            ["1435-1555", "", "", "", "", ""],
            ["1435-1625", "", "", "", "", ""],
            ["1535-1625", "", "", "", "", ""],
            ["1605-1725", "", "", "", "", ""],
            ["1635-1725", "", "", "", "", ""],
            ["1735-1855", "", "", "", "", ""],
            ["1835-1925", "", "", "", "", ""],
            ];

        schedule.forEach((Item) => {
            ["lec", "lab", "tut"].forEach(type => {

                if (Item[type]) {
                const course = Item[type];
                const time = course.TIMES;
                

                const rowIndex = scheduleTable.findIndex(r => r[0] === time);

                if (rowIndex !== -1) {
                        // loop through all days
                       Object.keys(days).forEach(day => {
                            if (course[day]) { // non-null means it meets
                                const colIndex = days[day];
                                scheduleTable[rowIndex][colIndex] = 
                                    `${course.SUBJ_CODE} ${course.CRSE_NUMB} ${type.toUpperCase()}`;
                            }
                        });
                    }
                }
            })
        })

        scheduleTable = scheduleTable.filter(row => 
            !row.slice(1, 6).every(cell => cell === "")
        );

        finalSchedules.push(scheduleTable);
    
    })
    
    return finalSchedules;
}

function displayScheduleTable(scheduleTable, container) {
    const table = document.createElement("table");
    table.border = "1";
    table.style.borderCollapse = "collapse";
    table.style.marginBottom = "20px";

    // Header row
    const headerRow = document.createElement("tr");
    ["TIME", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        th.style.padding = "5px";
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Table rows
    scheduleTable.forEach(rowData => {
        const row = document.createElement("tr");
        rowData.forEach(cellData => {
            const td = document.createElement("td");
            td.textContent = cellData;
            td.style.padding = "5px";
            td.style.textAlign = "center";
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    container.appendChild(table);
}