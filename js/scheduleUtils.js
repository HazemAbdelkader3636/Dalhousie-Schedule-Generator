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
        return true;
    }

    let start1 = parseInt(firstClass.TIMES.substring(0,4));
    let end1   = parseInt(firstClass.TIMES.substring(5,9));
    let start2 = parseInt(secondClass.TIMES.substring(0,4));
    let end2   = parseInt(secondClass.TIMES.substring(5,9));

    return start1 < end2 && start2 < end1;
}

/*


*/
function permute(slots) {
    let result = [];

    backtrack([], 0, slots, result);
    return result;
}

/*


*/
function backtrack(combination, index, slots, result)  {
  if (combination.length === slots.length) {
    result.push(Array.from(combination));
  }
  else {
    const currentSlot = slots[index];
    for (let item of currentSlot) {
    combination.push(item);
    backtrack(combination, index + 1, slots, result);
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

    if (classes.hasLink) {
        classes.link.forEach(link => {
           combos.push({lec, link});
        });

    } else {
        combos.push({lec});
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