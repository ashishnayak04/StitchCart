import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-surface-raised border border-border p-6 sticky top-24 shadow-1">
      <h2 className="heading text-foreground mb-6">Filters</h2>
      <div className="space-y-6">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="overline text-muted mb-4">
                {keyItem === "category" ? "Category" : "Brand"}
              </h3>
              <div className="space-y-3">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex items-center gap-3 cursor-pointer text-sm text-foreground hover:text-accent transition-colors"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
