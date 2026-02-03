import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMockData } from "@/contexts/MockDataContext";

type UploadState = "idle" | "uploading" | "processing" | "complete";

const banks = ["CIMB", "Maybank", "RHB"];
const names = [
  "Ahmad Bin Ismail",
  "Nur Aisyah Binti Rahman",
  "Lim Wei Jie",
  "Krishnan A/L Muthu",
  "Fatimah Binti Osman",
];

function generateRandomRows(fileName: string, bank: string, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    sourceFile: fileName,
    bank,
    clientName: names[Math.floor(Math.random() * names.length)],
    accountNo: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    dueAmount: Math.floor(1000 + Math.random() * 50000) + Math.random(),
    dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: Math.random() > 0.1 ? 'valid' : 'invalid' as 'valid' | 'invalid',
  }));
}

export function ManualUploadDialog() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");

  const { addActivity, addStandardizedRows } = useMockData();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const simulateUpload = async (file: File) => {
    setFileName(file.name);
    setState("uploading");

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProgress(i);
    }

    setState("processing");
    setProgress(0);

    // Simulate AI processing
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      setProgress(i);
    }

    setState("complete");

    // Generate random data
    const randomBank = banks[Math.floor(Math.random() * banks.length)];
    const rowCount = Math.floor(200 + Math.random() * 800);
    
    // Add to activity log
    addActivity({
      fileName: file.name,
      source: "upload",
      bank: randomBank,
      status: "completed",
      rows: rowCount,
      timestamp: "Just now",
    });

    // Add standardized rows
    const newRows = generateRandomRows(file.name, randomBank, Math.min(rowCount, 5));
    addStandardizedRows(newRows);

    toast({
      title: "File processed successfully",
      description: `${file.name} - ${rowCount} rows standardized and ready for export.`,
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  }, [addActivity, addStandardizedRows]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  const resetDialog = () => {
    setState("idle");
    setProgress(0);
    setFileName("");
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-md hover:shadow-lg transition-shadow">
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Manual File</span>
          <span className="sm:hidden">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manual File Upload</DialogTitle>
          <DialogDescription>
            Upload an Excel file for immediate processing. Supports .xlsx, .xls, and .csv formats.
          </DialogDescription>
        </DialogHeader>

        {state === "idle" && (
          <div
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium">Drag and drop your file here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            <div className="flex gap-2 mt-4">
              <span className="text-2xs text-muted-foreground px-2 py-1 bg-muted rounded">
                .xlsx
              </span>
              <span className="text-2xs text-muted-foreground px-2 py-1 bg-muted rounded">
                .xls
              </span>
              <span className="text-2xs text-muted-foreground px-2 py-1 bg-muted rounded">
                .csv
              </span>
            </div>
          </div>
        )}

        {(state === "uploading" || state === "processing") && (
          <div className="flex flex-col items-center py-8">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{fileName}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {state === "uploading" ? "Uploading..." : "Analyzing Excel Structure..."}
            </p>
            <Progress value={progress} className="w-full max-w-xs" />
          </div>
        )}

        {state === "complete" && (
          <div className="flex flex-col items-center py-8">
            <div className="relative">
              <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
              <div className="relative rounded-full bg-success/10 p-4 mb-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </div>
            <p className="text-sm font-medium mt-4">Processing Complete!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Data standardized and added to inspector
            </p>
            <Button onClick={() => setOpen(false)} className="mt-4">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
