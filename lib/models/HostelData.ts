import mongoose, { Schema, Document } from 'mongoose';

export interface IHostelData extends Document {
  branches: Array<{
    id: string;
    title: string;
    location: string;
    badge: string;
    icon: string;
    bg: string;
    href: string;
    startingPrice?: string;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  branchDetails: Record<string, any>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HostelDataSchema = new Schema<any>(
  {
    branches: { type: [Schema.Types.Mixed], required: true },
    branchDetails: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

// Prevent model re-compilation in Next.js dev hot-reload
export const HostelDataModel =
  (mongoose.models.HostelData as mongoose.Model<IHostelData>) ||
  mongoose.model<IHostelData>('HostelData', HostelDataSchema);
