import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Booking } from "../../_components/CompanyTypes";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "in-progress":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

export const OrderTable = ({
  orders,
  selectedDate,
  currentPage,
  totalPages,
  onPageChange,
  onCancel,
}: {
  orders: Booking[];
  selectedDate?: Date;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCancel: (orderId: string) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Захиалгын жагсаалт</CardTitle>
        <CardDescription>
          {selectedDate
            ? `${format(selectedDate, "PPP")} өдөрт хамаарах захиалгууд`
            : "Шүүлтийн дагуу харуулж байна"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Үйлчлүүлэгч</TableHead>
              <TableHead>Ажилтан</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead>Цаг</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.user?.username || "—"}</TableCell>
                <TableCell>{order.employee?.employeeName || "—"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(order.selectedTime).toLocaleString("mn-MN")}
                </TableCell>
                <TableCell>
                  {order.status === "confirmed" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onCancel(order._id)}
                    >
                      Цуцлах
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
