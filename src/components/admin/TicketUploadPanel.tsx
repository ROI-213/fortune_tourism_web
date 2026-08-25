import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Download, Eye, Trash2, File as FileIcon } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/booking-utils";

interface TicketUploadPanelProps {
  bookingId: number;
  bookingType: string;
  onDocumentUploaded: () => void;
}

interface DocumentRow {
  id: number;
  file_name: string;
  document_type: string;
  version: number;
  uploaded_at: string;
  storage_file_id: number;
}

const DOCUMENT_TYPES = [
  "Original Ticket",
  "Travel Voucher",
  "Payment Receipt",
  "Other"
];

export function TicketUploadPanel({
  bookingId,
  bookingType,
  onDocumentUploaded
}: TicketUploadPanelProps) {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string>("Original Ticket");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, [bookingId]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const key = sessionStorage.getItem("fortune_admin_key") || "";
      const res = await fetch(`/api/bookings/${bookingId}/documents`, {
        headers: { "x-admin-key": key },
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents || []);
      } else {
        toast.error("Failed to load documents");
      }
    } catch (err) {
      toast.error("Error loading documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only PDF, JPG, and PNG are allowed.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return false;
    }
    return true;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        await uploadFile(file);
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        await uploadFile(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", selectedDocType);

    try {
      const key = sessionStorage.getItem("fortune_admin_key") || "";
      const res = await fetch(`/api/bookings/${bookingId}/documents`, {
        method: "POST",
        headers: {
          "x-admin-key": key,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Document uploaded successfully");
        await fetchDocuments();
        onDocumentUploaded();
      } else {
        toast.error(data.error || "Failed to upload document");
      }
    } catch (err) {
      toast.error("Error uploading document");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc: DocumentRow) => {
    if (!confirm(`Are you sure you want to delete ${doc.file_name}?`)) return;
    
    try {
      const key = sessionStorage.getItem("fortune_admin_key") || "";
      const res = await fetch(`/api/bookings/${bookingId}/documents?doc_id=${doc.id}`, {
        method: "DELETE",
        headers: { "x-admin-key": key },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Document deleted");
        await fetchDocuments();
      } else {
        toast.error(data.error || "Failed to delete document");
      }
    } catch (err) {
      toast.error("Error deleting document");
    }
  };

  return (
    <div className="rounded-xl border border-border p-4 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-slate-500" />
        <h3 className="font-bold text-[color:var(--color-navy)] uppercase text-xs tracking-wider">
          Ticket & Document Management
        </h3>
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-600 mb-1 block">Document Type</label>
        <select
          className="w-full sm:w-64 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          value={selectedDocType}
          onChange={(e) => setSelectedDocType(e.target.value)}
          disabled={uploading}
        >
          {DOCUMENT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"
        } ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
          disabled={uploading}
        />
        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
        <p className="text-sm font-medium text-slate-700">
          {uploading ? "Uploading..." : "Click or drag file to upload"}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Supports PDF, JPG, PNG (Max 10MB)
        </p>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-2">Uploaded Documents ({documents.length})</h4>
        
        {loading ? (
          <div className="text-center py-4 text-xs text-slate-500">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-100">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-left text-slate-500">
                <tr>
                  <th className="py-2 px-3 rounded-tl-md">File Name</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Version</th>
                  <th className="py-2 px-3">Upload Date</th>
                  <th className="py-2 px-3 text-right rounded-tr-md">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-medium">
                      <div className="flex items-center gap-1.5 max-w-[150px] sm:max-w-[200px]">
                        <FileIcon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate" title={doc.file_name}>{doc.file_name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">{doc.document_type}</td>
                    <td className="py-2 px-3">v{doc.version}</td>
                    <td className="py-2 px-3 text-slate-500">
                      {formatDateTime(doc.uploaded_at)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/api/storage/files/${doc.storage_file_id}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-600 inline-block"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <a
                          href={`/api/storage/files/${doc.storage_file_id}?download=1`}
                          download={doc.file_name}
                          title="Download"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded hover:bg-slate-200 text-blue-600 inline-block"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(doc);
                          }}
                          className="p-1.5 rounded hover:bg-rose-100 text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
