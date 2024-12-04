"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { convertJson } from "@/app/actions";

interface JsonInputProps {
  onConvert: (result: string) => void;
  initialJson: string;
  setJson: (json: string) => void;
  interfaceName: string;
}

export function JsonInput({
  onConvert,
  initialJson,
  setJson,
  interfaceName,
}: JsonInputProps) {
  const [localJson, setLocalJson] = useState(initialJson);

  useEffect(() => {
    setLocalJson(initialJson);
  }, [initialJson]);

  const handleConvert = async () => {
    const { result } = await convertJson(localJson, interfaceName);
    onConvert(result);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalJson(newValue);
    setJson(newValue);
  };

  return (
    <div className="flex flex-col space-y-4">
      <Textarea
        placeholder="Enter your JSON here..."
        value={localJson}
        onChange={handleChange}
        className="h-[calc(100vh-350px)] resize-none font-mono"
      />
      <Button onClick={handleConvert}>Convert to TypeScript</Button>
    </div>
  );
}
