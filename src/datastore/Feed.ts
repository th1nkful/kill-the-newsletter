import gstore from './gstore';

const { Schema } = gstore;

export interface FeedModel {
  feedId: string;
  userId?: string;
  title: string;
  description?: string;
  feedEmail: string;
  feed_url: string;
  site_url: string;
  image_url?: string;
  pubDate?: Date;
  createdOn?: Date;
  modifiedOn?: Date;
}

const Feed = new Schema<FeedModel>({
  feedId: { type: String, required: true },
  userId: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  feedEmail: { type: String, required: true },
  feed_url: { type: String, required: true },
  site_url: { type: String, required: true },
  image_url: { type: String },
  pubDate: {
    type: Date,
    default: gstore.defaultValues.NOW,
  },
  createdOn: {
    type: Date,
    default: gstore.defaultValues.NOW,
  },
  modifiedOn: { type: Date },
});

export default gstore.model('Feed', Feed);
