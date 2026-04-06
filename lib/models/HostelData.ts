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
    startingPrice?: number;   // stored as number; undefined = hidden on listing
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  branchDetails: Record<string, any>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HostelDataSchema = new Schema<any>(
  {
    // Store both as opaque Mixed blobs — no Mongoose array casting, no field stripping.
    // This ensures arbitrary branch fields (e.g. startingPrice: number) survive save/load.
    branches:      { type: Schema.Types.Mixed, default: [] },
    branchDetails: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    strict: false,   // never strip unknown fields from the document
  }
);

// Prevent model re-compilation in Next.js dev hot-reload
export const HostelDataModel =
  (mongoose.models.HostelData as mongoose.Model<IHostelData>) ||
  mongoose.model<IHostelData>('HostelData', HostelDataSchema);
