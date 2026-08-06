import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="display-md text-foreground mb-8">My Account</h1>
      <div className="bg-surface-raised border border-border p-6 lg:p-8 shadow-1">
        <Tabs defaultValue="orders">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="address">Addresses</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <ShoppingOrders />
          </TabsContent>
          <TabsContent value="address">
            <Address />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ShoppingAccount;
