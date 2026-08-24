export interface PackageDefinition {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  allowText: boolean;
  allowMusic: boolean;
  allowCustomTheme: boolean;
  allowCustomLayout: boolean;
}
