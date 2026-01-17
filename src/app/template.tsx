"use client";

import {queryClient} from '@/lib/queryClient';
import React from 'react'
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const RootTemplate = ({
                          children
                      }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}

export default RootTemplate