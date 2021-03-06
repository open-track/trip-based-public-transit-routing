import TripRepository from './../lib/trip/repository/TripRepository';
import DatabaseFootpathRepository from '../lib/transfer/repository/DatabaseFootpathRepository';
import GenerateTransfers from "./cli/command/GenerateTransfers";
import TransferRepository from "../lib/transfer/repository/TransferRepository";
import RunQuery from "./cli/command/RunQuery";

export default class {

    @cached
    public db() {
        return require("mysql2/promise").createPool({
            host: 'localhost',
            user: 'root',
            password: null,
            database: 'ojp',
            connectionLimit: 5,
            acquireTimeout: 1000,
            Promise: require("bluebird")
            //debug: ['ComQueryPacket', 'RowDataPacket']
        });
    }

    public dbFactory() {
        return require("mysql2/promise").createPool({
            host: 'localhost',
            user: 'root',
            password: null,
            database: 'ojp',
            connectionLimit: 5,
            acquireTimeout: 1000,
            Promise: require("bluebird")
            //debug: ['ComQueryPacket', 'RowDataPacket']
        });
    }

    @cached
    public tripRepository(): TripRepository {
        return new TripRepository(this.db());
    }

    @cached
    public footpathDatabase(): DatabaseFootpathRepository {
        return new DatabaseFootpathRepository(this.db());
    }

    @cached
    public transferRepository(): TransferRepository {
        return new TransferRepository(this.db());
    }

    @cached
    public generateTransfersCommand(): GenerateTransfers {
        return new GenerateTransfers(
            this.tripRepository(),
            this.footpathDatabase(),
            this.dbFactory,
        );
    }

    @cached
    public runQueryCommand(): RunQuery {
        return new RunQuery(
            this.tripRepository(),
            this.transferRepository(),
            this.footpathDatabase()
        );
    }
}

/**
 * This decorator will execute a method once and store the result, returning the 
 * original result for subsiquent calls. Similar to memoize but ignoring arguments.
 */
function cached(target, name, descriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args) {
        if (!this["__cached_value_" + name]) {
            this["__cached_value_" + name] = method.apply(this, args);
        }

        return this["__cached_value_" + name];
    }
}