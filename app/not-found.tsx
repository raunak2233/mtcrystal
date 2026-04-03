import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-purple-600">404</h1>
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline">
              <Search className="mr-2 h-5 w-5" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
