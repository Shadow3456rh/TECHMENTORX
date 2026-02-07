"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/scan");
    }, [router]);

    return (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">Initializing Security Console...</p>
            </div>
        </div>
    );
}
