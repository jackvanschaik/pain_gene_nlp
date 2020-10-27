plot_gene = function() {
    // prep for plotting
    document.getElementById("tf_out").innerHTML = "";
    table = document.getElementById("tf_table");
    title = document.getElementById("tf_title");
    title.innerHTML = "";
    table.innerHTML = "";
    var gene_name = document.getElementById("gene_select").value;
    
    // add title
    title.innerHTML = gene_name+": Top 25 of "+gene_doc[gene_name].tf.length;
    
    // do plot 
    var gene_data  = gene_to_data(gene_name);
    var plot_data = gene_data.slice(0,25);
    var svg = dimple.newSvg("#tf_out", 500, 500);
    var chart = new dimple.chart(svg, plot_data);
    chart.addCategoryAxis("x", "pubmed_id");
    chart.addMeasureAxis("y", "tf");
    chart.addSeries(null, dimple.plot.bar);
    chart.draw();
    
    // add table
    tf_table = $('#tf_table').DataTable({
        data: gene_data,
        columns: [{data: 'pubmed_id'}, {data:'link'}, {data: 'tf'}],
        destroy: true
    });
}
;

gene_to_data = function(gene_name) {
    var X = gene_doc[gene_name];
    var Y = cols_to_table([X.pubmed_id, X.tf], ["pubmed_id", "tf"]);
    for (var i in Y) {
        Y[i].link = pubmed_link(Y[i].pubmed_id);
    }
    return(Y);
}
;

pubmed_link = function(id) {
    pm_url = "https://pubmed.ncbi.nlm.nih.gov/" + id;
    html = "<a href=\"" + pm_url + "\">" + id + "</a";
    return(html);
}
;

// takes an array of cols as an argument
// and puts it in data frame format with col_names
cols_to_table = function(cols, col_names) {
    //first, make sure columns have same length
    k = cols.length;
    if (k > 1) {
        for (var j in cols) {
            var len = cols[j].length;
            if (j > 0) {
                if (last_len != len) {
                    throw "Error: column lengths not equal";
                }
            }
            var last_len = len;
        }
    } 
    
    // then, put in the proper format
    N = cols[0].length;
    tbl = Array();
    for (var i = 0; i < N; i++) {
        row = {};
        for (var c = 0; c < k; c++) {
            row[col_names[c]] = cols[c][i];
        }
        tbl.push(row);
    }
    return(tbl);
}
;
