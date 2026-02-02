import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, Loader2, X } from "lucide-react";
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

type UploadState = "idle" | "uploading" | "processing" | "complete";

export function ManualUploadDialog() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");

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

    toast({
      title: "File processed successfully",
      description: `${file.name} - 456 rows standardized and ready for export.`,
    });

    // Reset after delay
    setTimeout(() => {
      setOpen(false);
      setState("idle");
      setProgress(0);
      setFileName("");
    }, 2000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  }, []);

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
        <Button className="gradient-primary gap-2 shadow-md hover:shadow-lg transition-shadow">
          <Upload className="h-4 w-4" />
          Upload Manual File
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
            <div className="rounded-full bg-success/10 p-4 mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <p className="text-sm font-medium">Processing Complete!</p>
            <p className="text-xs text-muted-foreground mt-1">
              456 rows standardized successfully
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
