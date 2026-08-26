import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface TicketCopyData {
  ticketNumber: string;
  pnrNumber: string;
  bookingDate: string;
  passengerName: string;
  passengerPhone: string;
  tourType: string;
  fromLocation: string;
  toLocation: string;
  departureOn: string;
  tripType: string;
  vehicleOrMode: string;
  boardingPoint: string;
}

export function downloadTicketCopyPDF(data: TicketCopyData) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Box Border
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.8);
  doc.roundedRect(12, 12, pageWidth - 24, 115, 2, 2, "S");

  // Subheader
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text("This copy For Passengers Who Travelling", 16, 20);

  // Main Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(10, 10, 10);
  doc.text("Ticket Copy For Your Journey", 16, 27);

  doc.setFontSize(9);
  doc.text(`BOOKING DATE : ${data.bookingDate}`, pageWidth - 16, 27, { align: "right" });

  // Main Grid Table
  autoTable(doc, {
    startY: 32,
    margin: { left: 16, right: 16 },
    theme: "grid",
    styles: {
      fontSize: 8.5,
      cellPadding: 3.5,
      textColor: [20, 20, 20],
      lineColor: [20, 20, 20],
      lineWidth: 0.4,
    },
    head: [],
    body: [
      [
        { content: "Passenger Name:", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: (data.passengerName || "FORTUNE GROUP").toUpperCase(), styles: { fontStyle: "bold" } },
        { content: "Passenger Phone No.:", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: data.passengerPhone || "9845003000", styles: { fontStyle: "bold" } },
        { content: "Tour Type", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: (data.tourType || "LOCAL TRIP").toUpperCase(), styles: { fontStyle: "bold" } },
      ],
      [
        { content: "FROM", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: (data.fromLocation || "BANGALORE").toUpperCase(), colSpan: 2, styles: { fontStyle: "bold" } },
        { content: "TO:", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: (data.toLocation || "BANGALORE").toUpperCase(), colSpan: 2, styles: { fontStyle: "bold" } },
      ],
      [
        { content: "Ticket Number:", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: data.ticketNumber || "FT3423CZ", styles: { fontStyle: "bold" } },
        { content: "PNR Number:", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: data.pnrNumber || "FC17G3423", styles: { fontStyle: "bold" } },
        { content: "Departure On:", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: data.departureOn, styles: { fontStyle: "bold" } },
      ],
      [
        { content: "Trip Type:", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: (data.tripType || "PACKAGE").toUpperCase(), styles: { fontStyle: "bold" } },
        { content: "Type Of Car:/bus/Flight", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: (data.vehicleOrMode || "MARUTI SUZUKI CIAZ").toUpperCase(), styles: { fontStyle: "bold" } },
        { content: "Boarding point:", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: (data.boardingPoint || "BANGALORE AIRPORT").toUpperCase(), styles: { fontStyle: "bold" } },
      ],
    ],
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 100;

  // Terms & Conditions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  doc.text("TERMS & INSTRUCTIONS", 16, finalY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text("1. Please carry this ticket copy / SMS during your journey.", 16, finalY + 13);
  doc.text("2. Driver & vehicle assignment details will be shared prior to departure.", 16, finalY + 18);
  doc.text("3. 24/7 Helpline & Support: +91 9740463404 | Fortune Tourism Bangalore.", 16, finalY + 23);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Fortune Tourism & Travels · No.256/A Next To Narayana Hospital, Health City, Bommasandra, Bangalore. 560099",
    pageWidth / 2,
    finalY + 32,
    { align: "center" }
  );

  doc.save(`Fortune-Tourism-Ticket-${data.ticketNumber}.pdf`);
}
