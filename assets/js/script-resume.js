document.getElementById("download-resume").addEventListener("click", function() {
    var element = document.querySelector(".resume-container");
    var opt = {
      margin: 0,
      filename: 'Marjo_Paguia_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      // Ensure 'autoPrint' is set to false or not included
    };
  
    html2pdf().from(element).set(opt).save();
  });