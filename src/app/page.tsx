"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";
import { Recommendation, FormData } from '@/interface';
import { formatCurrency } from '@/lib/utils';

export default function InsuranceFormPage() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    income: '',
    dependents: '',
    risk: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation[] | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormSubmitted(true);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setRecommendation(data.data);

    } catch (error: unknown) {

      if (error instanceof Error) {
        console.log({ message: error.message });
      } else {
        console.log({ message: 'Unexpected error', error });
      }

      toast.error('Something went wrong. Please try again.');

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={`transition-all grid gap-6 w-full max-w-5xl duration-700 ${formSubmitted ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 justify-center'}`}>

        {/* Form Section */}
        <Card className="w-full max-w-md mx-auto shadow-xl transition-transform duration-700">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-center">Find the Right Life Insurance Plan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  type="number"
                  id="age"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={e => handleChange('age', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  type="text"
                  id="income"
                  placeholder="Enter your income"
                  value={formatCurrency(formData.income)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, '');
                    handleChange('income', raw);
                  }}
                  required
                  disabled={loading}
                />

              </div>

              <div className="space-y-2">
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  type="number"
                  id="dependents"
                  placeholder="Enter number of dependents"
                  value={formData.dependents}
                  onChange={e => handleChange('dependents', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Risk Tolerance</Label>
                <Select value={formData.risk} onValueChange={value => handleChange('risk', value)}>
                  <SelectTrigger disabled={loading}>
                    <SelectValue placeholder="Select your risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Processing...' : 'Find My Best Plan'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recommendation Section */}
        {formSubmitted && (
          <div className="flex flex-col gap-4 w-full items-center px-2">
            {loading ? (
              <div className="space-y-4 w-full max-w-md">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : recommendation?.length ? (
              recommendation.map((response, index) => (
                <Card key={index} className="w-full max-w-md shadow-lg">
                  <CardContent className="p-6 space-y-2">
                    <h3 className="text-lg font-semibold">Recommended Plan: {response.plan}</h3>
                    <p><strong>Coverage:</strong> {response.coverage}</p>
                    <p><strong>Term:</strong> {response.termLength}</p>
                    <p className="text-muted-foreground text-sm">{response.explanation}</p>
                  </CardContent>
                </Card>
              ))
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
