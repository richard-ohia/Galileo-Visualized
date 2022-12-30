const buttonEl = document.getElementById("cButton");
var selectAllEl = document.getElementById("Select-All");

/**
 * Deals with displaying checkboxes based on select value.
 */
$(document).ready(function(){

    s = $('select[id="type-class"]');
    
    $(s).change(function()
    {
        let wordClassEl = document.getElementById("PartOfSpeech");
        let tenseEl = document.getElementById("Tense");
        let namesEL = document.getElementById("Names");
        if( s.val() === "WordClass" ) {
            wordClassEl.style.display = "block";
            tenseEl.style.display = "none";
            namesEL.style.display = "none";
        } else if ( s.val() === "Tense") {
            wordClassEl.style.display = "none";
            tenseEl.style.display = "block";
            namesEL.style.display = "none";
        } else if ( s.val() === "NamesTextsAppearedIn") {
            wordClassEl.style.display = "none";
            tenseEl.style.display = "none";
            namesEL.style.display = "block";
        } else {
            wordClassEl.style.display = "none";
            tenseEl.style.display = "none";
            namesEL.style.display = "none";
        }
    });
});

/**
 * Event Listener for the select all button associated with the authors' checkboxes.
 */
selectAllEl.addEventListener('change', function() {
    if (this.checked) {
    var el =document.getElementsByName('Names');  
    for(var i=0; i < el .length; i++){  
        if(el[i].type=='checkbox')  
            el[i].checked=true;  
    } 
    } else {
    var ele=document.getElementsByName('Names');  
    for(var i=0; i<ele.length; i++){  
        if(ele[i].type=='checkbox')  
            ele[i].checked=false;        
    } 
    }
});

/**
 * Event Listener for the comparison form.
 * Validates user's input and calls on a valid function to output a d3 visualization.
 */
buttonEl.addEventListener("click", () => {    

    const sectionOne = document.getElementById("section1").value;
    const sectionTwo = document.getElementById("section2").value;
    const metadataType = document.getElementById("type-class").value;


    if(((sectionOne < 24 && sectionOne >= 0) && sectionOne !== "") && ((sectionTwo < 24 && sectionTwo >= 0) && sectionTwo !== "")) {
        let imageVisOne = document.getElementById("imageVisOne");
        let imageVisTwo = document.getElementById("imageVisTwo");

        if(imageVisOne !== null && imageVisTwo !== null) {
            imageVisOne.remove();
            imageVisTwo.remove();
        }

        if(metadataType === "RawSaggFreq" || metadataType === "RelSaggFreq" || metadataType === "EarliestAppearance") 
        {
        singleAccess(sectionOne, metadataType, "#visualOne");
        singleAccess(sectionTwo, metadataType, "#visualTwo");
        }
        else {
        splitAccess(sectionOne, metadataType, "#visualOne");
        splitAccess(sectionTwo, metadataType, "#visualTwo");
        }

    } else {
        alert("Both sections must be between 0 - 23");
    }

});

/**
 * Creates a HashCode
 *
 * @param   str  The string we are trying to create a hashcode for.
 * @returns The created hash code.
 */
function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

/**
 * Transforms an integer into a string that resembles that of RGB.
 * Takes care of all color blindness, by using only colors that can be seen by everyone.
 *
 * @param   i  The integer being transformed.
 * @returns An RGB string representation of i.
 */
function intToRGB (i) {
    // Check if the color is one that may be difficult for people with
    // red-green color blindness to distinguish
    if (i == 0x663399 || i == 0x800000 || i == 0xFF00FF || i == 0x000080) {
    // Change the color to one that is more distinguishable for people with
    // red-green color blindness
    i = 0x0000FF;
    }
    // Check if the color is one that may be difficult for people with
    // blue-yellow color blindness to distinguish
    else if (i == 0xFFFF00 || i == 0x00FFFF || i == 0x808000) {
    // Change the color to one that is more distinguishable for people with
    // blue-yellow color blindness
    i = 0xFF0000;
    }
    // Check if the color is one that may be difficult for people with
    // total color blindness (achromatopsia) to distinguish
    else if (i == 0x000000 || i == 0x808080 || i == 0xFFFFFF) {
    // Change the color to one that is more distinguishable for people with
    // total color blindness (achromatopsia)
    i = 0xFFA500;
    }
    // Check if the color is one that may be difficult for people with
    // partial color blindness (deuteranopia) to distinguish
    else if (i == 0x996633 || i == 0xFFA07A || i == 0xFFD700 || i == 0xADD8E6) {
    // Change the color to one that is more distinguishable for people with
    // partial color blindness (deuteranopia)
    i = 0x00FF00;
    }

    var c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

/**
 * Gets all the checked values with the name of the checkboxes.
 *
 * @param   prop  The name of the checkbox being looped over.
 * @returns An output of all the checked checkboxes.
 */
function getCheckBoxHelper(prop) {
    let checkboxes= document.querySelectorAll(`input[name=${prop}]:checked`);
    let output= [];
    checkboxes.forEach((checkbox) => {
        if(checkbox !== "Select All") {
            output.push(checkbox.value);
        }
    });
    return output;
}

/**
 * Gets all the checked values of the metadata type.
 *
 * @param   metadataType  The name of the metadate type, 
 *                          we want to get the checked checkboxes for.
 * @returns An output of all the checked checkboxes.
 */
function getCheckBox(metadataType) {
    let output = [];
    if( metadataType === "WordClass" ) {
        output = getCheckBoxHelper("PartOfSpeech");
    } else if ( metadataType === "Tense") {
        output = getCheckBoxHelper("Tense");
    } else if ( metadataType === "NamesTextsAppearedIn") {
        output = getCheckBoxHelper("Names");
    } 

    return output;
}

/**
 * Creates a d3 visualization for a div, based on section and metadata type.
 * The metadata type does not require different rectangles for each metadata type
 * associated with one word.
 *
 * @param   section  The section being worked on.
 * @param   metadataType  The metadataType being worked on.
 * @param   visual  The section being worked on.
 */
function singleAccess(section, metadataType, visual) {
    d3.csv('../data/SaggiatoreAnnotatedLexicon.csv').then(function(d) {

        d = d.filter(a => a.Section === section);

        const margin = { top: 20, right: 0, bottom: 0, left: 0 }
        temp = (d.length),
        height = temp - margin.top - margin.bottom,
        width = 300 - margin.left - margin.right;

        let positionx = 0;
        let positiony = 0;
        let counter = 0;

        let tempColor;

        let tooltip = d3.select(visual)
        .append('div')
        .style('position', 'absolute')
        .style('padding', '1px 0')
        .style('background', 'black')
        .style('opacity', 0);

        d3.select(visual).select('svg').remove();

        d3.select(visual).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .selectAll('rect').data(d)
            .enter().append('rect')
            .attr('fill', function(d) {
                let colorType;
                if(metadataType === "RawSaggFreq") {
                colorType = d.RawSaggFreq;
                }
                else if(metadataType === "RelSaggFreq") {
                colorType = d.RelSaggFreq;
                }
                else if (metadataType === "EarliestAppearance"){
                colorType = d.EarliestAppearance;
                }
                let color = "#" + intToRGB(hashCode(colorType));
                return color;
            })
            .attr('width', '10px')
            .attr('height', '10px')
            .attr('x', function(d) {
                positionx++;
                if (positionx % 30 === 0) {
                positionx = 0;
                }
                return ((positionx * 10) - 10);
            })
            .attr('y', function(d) {
                counter++;
                if (counter % 30 === 0) {
                positiony += 10;
                }
                return positiony;
            })
            .style('opacity', function(d) {
                return Math.abs(1);
            })
            .on('mouseover', function(event, d) {
                const[x, y] = d3.pointer(event);
                tooltip.transition().duration(200)
                .style('opacity', .9);
                tooltip.html(
                '<div class="tooltip" style="width : 200px;">' +
                '<strong>word: </strong>' + d.Word + 
                '<br><strong>part of speech: </strong>' + d.WordClass+
                '<br><strong>tense: </strong>' + d.Tense +
                '<br><strong>author: </strong>' + d.NamesTextsAppearedIn.split(";")[0] + "..." +
                '<br><strong>raw frequency: </strong>' + d.RawSaggFreq +
                '<br><strong>oldest use: </strong>' + d.EarliestAppearance +
                '</div>'
                )
                .style('left', (event.pageX - 300) + 'px')
                .style('top', (event.pageY - 40) + 'px')
                tempColor = this.style.fill;
                d3.select(this)
                .style('fill', 'yellow');
            })
            .on('mouseout', function(d) {
                tooltip.html('');
                d3.select(this)
                    .style('fill', tempColor);
            });
        d3.select(visual).select('svg').attr('height', 
        d3.select(visual)
        .select('svg')
        .select('g')
        .node()
        .getBoundingClientRect().height + 100);
    }); // json import
};

/**
 * Creates a d3 visualization for a div, based on section and metadata type.
 * The metadata type does require different rectangles for each metadata type
 * associated with one word.
 *
 * @param   section  The section being worked on.
 * @param   metadataType  The metadataType being worked on.
 * @param   visual  The visual being worked on.
 */
function splitAccess(section, metadataType, visual) {
    d3.csv('../data/SaggiatoreAnnotatedLexicon.csv').then(function(d) {

        let checkbox = getCheckBox(metadataType);

        d = d.filter(a => a.Section === section);

        const margin = { top: 20, right: 0, bottom: 0, left: 0 }
        temp = (d.length * checkbox.length),
        height = temp - margin.top - margin.bottom,
        width = 300 - margin.left - margin.right;

        let positionx = 0;
        let positiony = 0;
        let counter = 0;

        let tempColor;
        // EarliestAppearance


        let tooltip = d3.select(visual)
        .append('div')
        .style('position', 'absolute')
        .style('padding', '1px 0')
        .style('background', 'black')
        .style('opacity', 0);

        d3.select(visual).select('svg').remove();
        d3.select(visual).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .selectAll('rect').data(d)
            .enter().each(function (d, i) {
            dataSplit = (d[metadataType]).split(";");
            d[metadataType] = dataSplit;
            for (let j = 0; j < dataSplit.length; j++) {
                dataSplit[j] = dataSplit[j].trim();
                if(!checkbox.includes(dataSplit[j])) {
                    console.log(dataSplit[j]);
                    break;
                }
                d3.select(this).append('rect')
                .attr('fill', function(d) {
                return  "#" + intToRGB(hashCode(dataSplit[j]));
                })
                .attr('width', '10px')
                .attr('height', '10px')
                .attr('x', function(d) {
                    positionx++;
                    if (positionx % 30 === 0) {
                    positionx = 0;
                    }
                    return ((positionx * 10) - 10);
                })
                .attr('y', function(d) {
                    counter++;
                    if (counter % 30 === 0) {
                    positiony += 10;
                    }
                    return positiony;
                })
                .style('opacity', function(d) {
                return Math.abs(1);
                })
                .on('mouseover', function(event, d) {
                    let wordClass = metadataType === "WordClass" ? d[metadataType][j] : d.WordClass;
                    let tense = metadataType === "Tense" ? d[metadataType][j] : d.Tense;
                    let author = metadataType === "NamesTextsAppearedIn" ? d[metadataType][j] : d.NamesTextsAppearedIn.split(";")[0] + "...";
                    const[x, y] = d3.pointer(event);
                    tooltip.transition().duration(200)
                    .style('opacity', .9);
                    tooltip.html(
                    '<div class="tooltip" style="width : 250px;">' +
                    '<strong>word: </strong>' + d.Word + 
                    '<br><strong>part of speech: </strong>' + wordClass+
                    '<br><strong>tense: </strong>' + tense +
                    '<br><strong>author: </strong>' + author +
                    '<br><strong>raw frequency: </strong>' + d.RawSaggFreq +
                    '<br><strong>oldest use: </strong>' + d.EarliestAppearance +
                    '</div>'
                    )
                    .style('left', (event.pageX - 300) + 'px')
                    .style('top', (event.pageY - 40) + 'px')
                    tempColor = this.style.fill;
                    d3.select(this)
                    .style('fill', 'yellow');
                })
                .on('mouseout', function(d) {
                    tooltip.html('');
                    d3.select(this)
                        .style('fill', tempColor);
                });
            }
        })
        d3.select(visual).select('svg').attr('height', 
        d3.select(visual)
        .select('svg')
        .select('g')
        .node()
        .getBoundingClientRect().height + 100);
    }); // json import
};