function kernelDensityEstimator(kernel, x) {
  return function(sample) {
    return x.map(function(x) {
      return [x, d3.mean(sample, function(v) { return kernel(x - v); })];
    });
  };
}

function epanechnikovKernel(scale) {
  return function(u) {
    return Math.abs(u /= scale) <= 1 ? .75 * (1 - u * u) / scale : 0;
  };
}

var conditionscolumns = [
  {
    "title": "Strain ID",
    "data": "id",
  },
  {
    "title": "Strain name",
    "data": "name"
  },
  {
    "title": "S-score",
    "data": "sscore",
    "sType": 'numeric'
  },
  {
    "title": "-log10(corrected p-value)",
    "data": "fdr",
    "sType": 'numeric'
  },
  {
    "title": "Phenotype",
    "data": "phenotype",
    "render": function (data, type, row, meta) {
        if(data == 'Sick') {
          return '<span class="label label-danger">' + data + '</div>'
        }
        else if (data == 'Overgrown') {
          return '<span class="label label-success">' + data + '</div>'
        }
        else {return data}
    }
  },
];

var allconditionscolumns = [
  {
    "title": "",
    "className": 'details-control',
    "orderable": false,
    "data": null,
    "defaultContent": '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>'
  },
  {
    "title": "Condition",
    "data": "condition",
  },
  {
    "title": "Chemical 1",
    "data": "chem1"
  },
  {
    "title": "Conc. 1",
    "data": "conc1",
  },
  {
    "title": "Chemical 2",
    "data": "chem2",
  },
  {
    "title": "Conc. 2",
    "data": "conc2",
  },
  {
    "title": "Temperature",
    "data": "temperature",
  },
  {
    "title": "Aerobiosis",
    "data": "aerobiosis",
  },
  {
    "title": "Media",
    "data": "media",
  },
];

$(document).ready(function() {
  d3.json("../data/conditions/all.txt", function(data) {
	  $.each(data, function(index, value) {
		  $('#conditions').append("<option value=\"" + value + "\">" + value + "</option>");
		  });
  });
  $("#conditions").select2({ width: '100%' });
  $('#conditions').change( function () {
    var value = this.value;
    
    d3.json("../data/conditions/" + value + ".tsv", function(error, scores) {
      if (error) console.log(error);

      var chart = $("#graph");
      var aspect = 0.4;
      var targetWidth = chart.width();

      var margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = targetWidth - margin.left - margin.right,
          height = targetWidth*aspect - margin.top - margin.bottom;
 
      var scores = scores.filter(Boolean);
      var vmin = Math.min.apply(null, scores);
      var vmax = Math.max.apply(null, scores);
      var bmax = Math.max(Math.abs(vmin),
                          Math.abs(vmax));
      var bmax = Math.max(5,
                          bmax);

      var x = d3.scale.linear() 
          .domain([-bmax, bmax])
          .range([0, width]);

      var y = d3.scale.linear() 
          .domain([0, 0.5])
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); });

      var histogram = d3.layout.histogram()
          .frequency(false)
          .bins(x.ticks(25));

      d3.select("#condition").remove();
      var svg = d3.select("#graph").append("svg")
          .attr("id", "condition")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
      
      var data = histogram(scores),
          kde = kernelDensityEstimator(epanechnikovKernel(1), x.ticks(100));

      svg.selectAll(".bar")
          .data(data)
        .enter().insert("rect", ".axis")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x) + 1; })
          .attr("y", function(d) { return y(d.y); })
          .attr("width", x(data[0].dx + data[0].x) - x(data[0].x) - 1)
          .attr("height", function(d) { return height - y(d.y); });

      svg.append("path")
         .datum(kde(scores))
          .attr("class", "line")
          .attr("d", line);
    });
    
    $('#condition-details').removeClass("hidden");
    $('#t-condition').text('');
    $('#t-condition').append(value);
    
    d3.json("../json/conditions.json", function(error, values) {
      if (error) console.log(error);
      var cdata = values['data'][value];
      
      $('#t-chem1').text('');
      $('#t-chem1').append(cdata['Chemical 1']);
      
      $('#t-conc1').text('');
      $('#t-conc1').append(cdata['Concentration for chemical 1']);
      
      $('#t-chem2').text('');
      $('#t-chem2').append(cdata['Chemical 2']);
      
      $('#t-conc2').text('');
      $('#t-conc2').append(cdata['Concentration for chemical 2']);
      
      $('#t-temp').text('');
      $('#t-temp').append(cdata['Incubation temperature']);
      
      $('#t-o2').text('');
      $('#t-o2').append(cdata['Aerobiosis']);
      
      $('#t-media').text('');
      $('#t-media').append(cdata['Background media']);
    });
    
    $('#condition-strains').removeClass("hidden");
    var stable = $('#strains').DataTable( {
        "ajax": "../json/conditions/" + value + ".json",
        "columns": conditionscolumns,
        "order": [[2, 'asc']],
        destroy: true,
      });

  });
  
  var ctable = $('#all-conditions').DataTable( {
    "ajax": "../json/all_conditions.json",
    "columns": allconditionscolumns,
    "order": [[1, 'asc']],
    "autoWidth": false
  });
  
  $('#all-conditions tbody').on('click', 'td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = ctable.row( tr );
    var data = row.data();
    var condition = data['condition'];
    
    $('#conditions-list-presentation').removeClass('active');
    $('#conditions-list').removeClass('active');
    $('#conditions-details-presentation').addClass('active');
    $('#conditions-details').addClass('active');
    
    $('#conditions').val(condition).change();
  } );
});

