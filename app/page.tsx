"use client";

import { useState, useEffect } from "react";
import { JsonInput } from "@/components/JsonInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [typeScript, setTypeScript] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [json, setJson] = useState("");
  const [interfaceName, setInterfaceName] = useState("RootObject");
  const [mappedInterfaces, setMappedInterfaces] = useState<string[]>([]);
  const { toast } = useToast();

  const handleConvert = (result: string) => {
    if (result.startsWith("Error:")) {
      setError(result);
      setTypeScript("");
      setMappedInterfaces([]);
    } else {
      setTypeScript(result);
      setError(undefined);
      const interfaces = result.match(/interface (\w+)/g);
      if (interfaces) {
        const mappedNames = interfaces
          .map((i) => i.split(" ")[1])
          .filter((name) => name !== interfaceName);
        setMappedInterfaces(mappedNames);
      }
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(typeScript);
    toast({
      title: "Copied!",
      description: "TypeScript output has been copied to clipboard.",
    });
  };

  useEffect(() => {
    if (mappedInterfaces.length > 0) {
      toast({
        title: "Interface Mapping",
        description: `The input interface "${interfaceName}" is mapped to additional interfaces: ${mappedInterfaces.join(
          ", "
        )}`,
      });
    }
  }, [mappedInterfaces, interfaceName]);

  return (
    <main className="container mx-auto p-4">
      <div
        className="flex justify-between items-center mb-8"
        style={{ maxWidth: "800px" }}
      >
        <h1 className="text-3xl font-bold mb-6">JSON to interface Converter</h1>
        <h4>
          <a href="https://github.com/kiridharan/json-to-interface">
            Feel free to contribute
          </a>
        </h4>
      </div>
      <div className="mb-4">
        <Label htmlFor="interface-name">Interface Name</Label>
        <Input
          id="interface-name"
          value={interfaceName}
          onChange={(e) => setInterfaceName(e.target.value)}
          placeholder="Enter interface name"
          className="max-w-xs"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>JSON Input</CardTitle>
            <CardDescription>
              Enter your JSON data here (supports single quotes, unquoted keys,
              and wrapped objects)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JsonInput
              onConvert={handleConvert}
              initialJson={json}
              setJson={setJson}
              interfaceName={interfaceName}
            />
            {/* <Button onClick={loadSample} className="mt-2">
              Load Sample JSON
            </Button> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              TypeScript Output
              <Button onClick={copyOutput} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Generated TypeScript interface or type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-500 whitespace-pre-wrap font-mono">
                {error}
              </div>
            ) : (
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto h-[calc(100vh-200px)]">
                <code>{typeScript}</code>
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
      {mappedInterfaces.length > 0 && (
        <Alert className="mt-4">
          <AlertTitle>Interface Mapping</AlertTitle>
          <AlertDescription>
            The input interface &ldquo;{interfaceName}&ldquo; is mapped to
            additional interfaces: {mappedInterfaces.join(", ")}
          </AlertDescription>
        </Alert>
      )}
    </main>
  );
}
