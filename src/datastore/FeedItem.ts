import { v4 as uuid } from 'uuid';
import gstore from './gstore';

const { Schema } = gstore;

export interface FeedItemModel {
  feedId: string;
  feedItemId?: string;
  title: string;
  description?: string;
  url: string;
  guid: string;
  author?: string;
  date?: Date;
  createdOn?: Date;
  modifiedOn?: Date;
}

const FeedItem = new Schema<FeedItemModel>({
  feedId: { type: String, required: true },
  feedItemId: {
    type: String,
    required: true,
    default: () => uuid().toLowerCase(),
  },
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  guid: { type: String, required: true },
  author: { type: String },
  date: { type: Date },
  createdOn: {
    type: Date,
    default: gstore.defaultValues.NOW,
    write: false,
    read: false,
  },
  modifiedOn: {
    type: Date,
  },
});

export default gstore.model('FeedItem', FeedItem);
