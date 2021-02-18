import { v4 as uuid } from 'uuid';
import { EntityKey } from 'gstore-node';

import { FeedModel } from './Feed';
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
  feed?: FeedModel | EntityKey;
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
  feed: {
    type: Schema.Types.Key,
    ref: 'Feed',
  },
});

export default gstore.model('FeedItem', FeedItem);
