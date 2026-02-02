import { useState } from "react";
import {
  Filter,
  Download,
  Database,
  CheckCircle2,
  XCircle,
  Search,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { standardizedData } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

export default function DataInspector() {
  const [bankFilter, setBankFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = standardizedData.filter((row) => {
    const matchesBank = bankFilter === "all" || row.bank === bankFilter;
    const matchesStatus = statusFilter === "all" || row.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      row.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.accountNo.includes(searchQuery);
    return matchesBank && matchesStatus && matchesSearch;
  });

  const handleExport = () => {
    toast({
      title: "Exporting to CSV",
      description: `${filteredData.length} records will be exported.`,
    });
  };

  const handlePushToDb = () => {
    toast({
      title: "Pushing to Database",
      description: `${filteredData.filter((r) => r.status === "valid").length} valid records queued for insertion.`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ms-MY", {
      style: "currency",
      currency: "MYR",
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Inspector</h1>
          <p className="text-muted-foreground">
            View and manage standardized data from all sources.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handlePushToDb} className="gap-2">
            <Database className="h-4 w-4" />
            Push to Database
          </Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={bankFilter} onValueChange={setBankFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Banks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  <SelectItem value="CIMB">CIMB</SelectItem>
                  <SelectItem value="Maybank">Maybank</SelectItem>
                  <SelectItem value="RHB">RHB</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="valid">Valid</SelectItem>
                  <SelectItem value="invalid">Invalid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[200px]">Source File</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Account No</TableHead>
                  <TableHead className="text-right">Due Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id} className="group">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.sourceFile}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {row.bank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{row.clientName}</TableCell>
                    <TableCell className="font-mono text-sm">{row.accountNo}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(row.dueAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(row.dueDate).toLocaleDateString("ms-MY")}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.status === "valid" ? (
                        <Badge
                          variant="outline"
                          className="bg-success/10 text-success border-success/30 gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-error/10 text-error border-error/30 gap-1"
                        >
                          <XCircle className="h-3 w-3" />
                          Invalid
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredData.length}</span> of{" "}
              <span className="font-medium">{standardizedData.length}</span> records
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
