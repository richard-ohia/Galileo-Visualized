

function hashCode(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
} 

function intToRGB(i){
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}


let containerEl = document.getElementById("container");
let buttonEl = document.getElementById("button-el");


buttonEl.addEventListener("click", () => {    

  const section = document.getElementById("section").value;
  const metadataType = document.getElementById("type-class").value;

  console.log(metadataType);
  
  if((section < 24 && section >= 0) && section != "") {

    containerEl.remove();

    d3.csv('../data/SaggiatoreAnnotatedLexicon.csv').then(function(d) {

      d = d.filter(a => a.Section == section);
      

      if(metadataType == "Raw Frequency") {
        let colorType = d.RelFreqLibrary;
      }
      else if (metadataType == "Oldest Use"){
       let colorType = d.EarliestAppearance;
      }

      const margin = { top: 20, right: 0, bottom: 0, left: 0 }
          height = 1600 - margin.top - margin.bottom,
          width = 300 - margin.left - margin.right;
    
        let positionx = 0;
        let positiony = 0;
        let counter = 0;

      let tempColor;
      // EarliestAppearance
    

      let tooltip = d3.select('#visual')
        .append('div')
        .style('position', 'absolute')
        .style('padding', '1px 0')
        .style('background', 'black')
        .style('opacity', 0);
    
        d3.select('#visual').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .selectAll('rect').data(d)
            .enter().append('rect')
              .attr('fill', function(d) {
                let colorType;
                if(metadataType == "RawFreqLibrary") {
                  colorType = d.RawFreqLibrary;
                }
                else if(metadataType == "RelFreqLibrary") {
                  colorType = d.RelFreqLibrary;
                }
                else if (metadataType == "EarliestAppearance"){
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
              .on('mouseenter', function(event, d) {
                const[x, y] = d3.pointer(event);
                tooltip.transition().duration(200)
                  .style('opacity', .9)
                tooltip.html(
                  '<div class="tooltip" >' +
                  '<strong>word: </strong>' + d.Word + 
                  '<br><strong>part of speech: </strong>' + d.WordClass +
                  '<br><strong>raw frequency: </strong>' + d.RelFreqLibrary +
                  '<br><strong>oldest use: </strong>' + d.EarliestAppearance +
                  '</div>'
                )
                  .style('left', (x) + 'px')
                  .style('top', (y) + 'px')
                tempColor = this.style.fill;
                d3.select(this)
                  .style('fill', 'yellow');
              })
              .on('mouseleave', function(d) {
                  tooltip.html('');
                  d3.select(this)
                    .style('fill', tempColor);
                });
    }); // json import
  } else {
    alert("Please Enter a Section Between 0 - 23");
  }

});