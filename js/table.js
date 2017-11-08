function addPMID (s) {
  if (s) {
    var out = '', i;
    var a = s.split(' ');
    for (i = 0; i < a.length; i++) {
	out += '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/' + a[i] + '">' + 
	      a[i] + '</a> '
    }
    return out
  } else { return '' }	  
}

function genomes (s) {
  if (s) {
    var out = '', i;
    var a = s.split(' ');
    for (i = 0; i < a.length; i++) {
	out += '<a href="../data/genomes/' + a[i] + '.gz" download>' + 
	      a[i].split('_')[1].split('.')[0] + '</a> <span class="glyphicon glyphicon-download" aria-hidden="true"></span> '
    }
    return out
  } else { return '' }	  
}

function annotations (s) {
  if (s) {
    var out = '', i;
    var a = s.split(' ');
    for (i = 0; i < a.length; i++) {
	out += '<a href="../data/annotations/' + a[i] + '" download>' + 
	      a[i].split('_')[1].split('.')[0] + '</a> <span class="glyphicon glyphicon-download" aria-hidden="true"></span> '
    }
    return out
  } else { return '' }	  
}

function bsl (s) {
  if (s) {
    if (s == 1) { return '<td class="success">BSL1</td>' }
    else if (s == 2) { return '<td class="warning">BSL2</td>' }
    else { return '<td>' + s + '</td>' }
  } else { return '<td></td>' }
}

function mta (s) {
  if (s) {
    if (s == 'No') { return '<td class="success">No</td>' }
    else if (s == 'Yes') { return '<td class="warning">Yes</td>' }
    else { return '<td>' + s + '</td>' }
  } else { return '<td></td>' }
}

function addLink (s) {
  if (s) {
    return '<a target="_blank" href="' + s +'">' + s + '</a>' 
  } else { return '' }
}

function format (d) {
    return '<div class="row"><div class="col-md-6">' +
        '<table class="table table-bordered table-striped">'+
        '<tr>'+
            '<td>Full name (if genome has been sequenced):</td>'+
            '<td>'+d.fullname+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Reference(s) (PMID):</td>'+
            '<td>'+addPMID(d.refs)+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Isolation source:</td>'+
            '<td>'+d.isolation+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Isolation year:</td>'+
            '<td>'+d.year+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>BSL level (Germany):</td>'+
            bsl(d.bsl)+
        '</tr>'+
        '<tr>'+
            '<td>Parental strain (if evolution experiment):</td>'+
            '<td>'+d.eparent+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Alternative strain name:</td>'+
            '<td>'+d.altname+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Notes:</td>'+
            '<td>'+d.notes+'</td>'+
        '</tr>'+
    '</table></div><div class="col-md-6">' +
    '<table class="table table-bordered table-striped">'+
        '<tr>'+
            '<td>Strain owner:</td>'+
            '<td>'+d.owner+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Website:</td>'+
            '<td>'+addLink(d.website)+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Contact:</td>'+
            '<td><span class="nope">'+d.email.split("").reverse().join("")+'</span></td>'+
        '</tr>'+
        '<tr>'+
            '<td>MTA needed:</td>'+
            mta(d.mta)+
        '</tr>'+
    '</table></div></div>'
    ;
}

var columnsDef = [
  {
    "title": "",
    "className": 'details-control',
    "orderable": false,
    "data": null,
    "defaultContent": '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'
  },
  {
    "title": "Strain ID",
    "data": "id",
  },
  {
    "title": "Strain name",
    "data": "name"
  },
  {
    "title": "Accession",
    "data": "ena",
    "render": function (data, type, row, meta) {
	if(data) {
        	return '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/bioproject/?term=' + data + '">' + data + '</a>';
	} else {return ''}
    }
  },
  {
    "title": "Assembly",
    "data": "assembly",
    "render": function (data, type, row, meta) {
        if(data) {
          return genomes(data)
        }
        else { return '' }
    }
  },
  {
    "title": "Annotation",
    "data": "annotation",
    "render": function (data, type, row, meta) {
        if(data) {
          return annotations(data)
        }
        else { return '' }
    }
  },
  {
    "title": "Broad phenotype",
    "data": "phenotype"
  },
  {
    "title": "Phenotypes",
    "data": "phenotypes",
    "render": function (data, type, row, meta) {
        if(data) {
          return '<a href="../data/phenotypes/' + data + '" download>Table</a> <span class="glyphicon glyphicon-download" aria-hidden="true"></span>'
        }
        else { return '' }
    }
  },
];

$(document).ready(function() {
  var table = $('#strains').DataTable( {
    "ajax": "../json/strains.json",
    "columns": columnsDef,
    "order": [[1, 'asc']]
  } );

  $('#strains tbody').on('click', 'td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = table.row( tr );
 
    if ( row.child.isShown() ) {
      row.child.hide();
      $(this).html('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>');
    }
    else {
      row.child( format(row.data()) ).show();
      $(this).html('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>');
    }
  } );
} );

