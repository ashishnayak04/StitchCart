import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPolicy } from "@/store/shop/policy-slice";

export default function ShoppingPolicy() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { current, isLoading } = useSelector((s) => s.policy);

  useEffect(() => { dispatch(getPolicy(slug)); }, [dispatch, slug]);

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-gray-500">Loading...</p></div>;
  if (!current) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-gray-500">Policy not found.</p></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{current.title}</h1>
      <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{current.content}</div>
    </div>
  );
}
