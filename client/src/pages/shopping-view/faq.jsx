import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFAQs } from "@/store/shop/faq-slice";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ShoppingFAQ() {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((s) => s.faq);
  const [openId, setOpenId] = useState(null);

  useEffect(() => { dispatch(getFAQs()); }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>
      {isLoading ? <p className="text-gray-500">Loading...</p> : items.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No FAQs available.</p>
      ) : (
        <div className="space-y-3">
          {items.map((faq) => (
            <div key={faq._id} className="border rounded-lg">
              <button onClick={() => setOpenId(openId === faq._id ? null : faq._id)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-medium text-sm">{faq.question}</span>
                {openId === faq._id ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
              </button>
              {openId === faq._id && <div className="px-4 pb-4 text-sm text-gray-600">{faq.answer}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
