var allgenescolumns = [
  {
    "title": "",
    "className": 'details-control',
    "orderable": false,
    "data": null,
    "defaultContent": '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>'
  },
  {
    "title": "Locus tag",
    "data": "locus",
  },
  {
    "title": "Gene name",
    "data": "name"
  },
  {
    "title": "ECK ID",
    "data": "eck",
  },
  {
    "title": "Uniprot ID",
    "data": "uniprot",
    "render": function (data, type, row, meta) {
	if(data) {
        	return '<a target="_blank" href="http://www.uniprot.org/uniprot/' + data + '">' + data + '</a>';
	} else {return ''}
    }
  }
];

$(document).ready(function() {
  d3.json("../data/id_flat.txt", function(data) {
	  $.each(data, function(index, value) {
		  $('#genes').append("<option value=\"" + value + "\">" + value + "</option>");
		  });
  });
  $("#genes").select2({ width: '100%' });
  
  $('#genes').change( function () {
    var value = this.value;
    var v2 = value.slice(0, 2)
    
    // empty the old viewer
    $('#features').empty()
    
    // load the data
    d3.json("../json/genes/" + v2 + "/" + value + ".json", function(error, values) {
      if (error) console.log(error);
      
      //add buttons for programmatic zoom
      var buttonResetZoom = '<a class="btn btn-info btnZoom" onclick="zoomOut()">Reset ZOOM</a>';

      $("#features").append("<p class='btnBlock'>"+buttonResetZoom+"</p");
      
        var ft = new FeatureViewer(values['protein']['sequence'],
                                 "#features",
                                 {
                                   showAxis: true,
                                   showSequence: true,
                                   brushActive: true,
                                   toolbar:true,
                                   bubbleHelp:true,
                                   zoomMax:10
                                 }
                                );

        values['variants'].forEach( function(s) {
          if (s['absent'] == 'true') {
            ft.addFeature({
                data: [{x:1,y:values['protein']['length'],description:'gene absent'}],
                name: s['ID'],
                className: s['ID'],
                color: "#f10c45",
                type: "rect"
              });  
          } else {
            var nonsyns = s['nonsyn'].map(function(obj) { 
                                       var d = {};
                                       d['x'] = parseInt(obj[1]);
                                       d['y'] = parseInt(obj[1]);
                                       d['description'] = obj[0] + " -> " + obj[2];
                                       d['id'] = values['protein']['uniprot'] + "_" + obj[0] + obj[1] + obj[2];
                                       return d;
                                    });
            var stops = s['stop'].map(function(obj) { 
                                       var d = {};
                                       d['x'] = parseInt(obj[1]);
                                       d['y'] = parseInt(obj[1]);
                                       d['description'] = obj[0] + " -> " + obj[2];
                                       return d;
                                    });
            ft.addFeature({
              data: nonsyns.concat(stops),
              name: s['ID'],
              className: s['ID'],
              color: "#0485d1",
              type: "rect"
            });
          };
        });

        //Get and print in the browser console the position of the feature selected
        /* ft.onFeatureSelected(function (d) {
            console.log(d.detail.id);
            // window.open('http://mutfunc.com/api/ecoli/' + d.detail.id, '_blank');
        });*/

        //functions to zoom programmatically
        zoomOut = function(){
         ft.resetZoom();      
        }
      });
    
  });
  
  var ctable = $('#all-genes').DataTable( {
    "ajax": "../json/all_genes.json",
    "columns": allgenescolumns,
    "order": [[1, 'asc']],
    "autoWidth": false
  });
  
  $('#all-genes tbody').on('click', 'td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = ctable.row( tr );
    var data = row.data();
    var name = data['name'];
    
    $('#genes-list-presentation').removeClass('active');
    $('#genes-list').removeClass('active');
    $('#genes-details-presentation').addClass('active');
    $('#genes-details').addClass('active');
    
    $('#genes').val(name).change();
  } );
});