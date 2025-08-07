import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export const OrderStats = ({
  total,
  selectedDate,
  filter,
}: {
  total: number;
  selectedDate?: Date;
  filter: string;
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Захиалгын тоо</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">
            {selectedDate
              ? `Сонгосон өдөрт`
              : filter === "all"
              ? "Нийт бүх захиалга"
              : "Шүүлттэй захиалгууд"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
