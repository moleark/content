import {Procedure} from '../tool';

const readQueueOutP:Procedure = {
    name: 'read_queue_out_p',
    params: [
        "_moniker varchar(200)",
    ],
    label: '_exit',
    code:
`
    select a.queue_out as queue
        from queue_p a join moniker b on a.moniker=b.id
        where b.moniker=_moniker;
`
}

const readQueueInP:Procedure = {
    name: 'read_queue_in_p',
    params: [
        "_moniker varchar(200)",
    ],
    label: '_exit',
    code:
`
    declare _monikerId int;
    declare _uniqueId bigint;

    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION ROLLBACK;
    start transaction;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker for update;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    select queue_in+1 into _uniqueId from queue_p where moniker=0 for update;
    if _uniqueId is null then
        set _uniqueId=1;
        insert into queue_p (moniker, queue_in, queue_out) values (0, _uniqueId, 0);
    else
        update queue_p set queue_in=_uniqueId where moniker=0;
    end if;
    select ifnull((select a.queue_in
        from queue_p a
        where a.moniker=_monikerId), 0) as queue,
        _uniqueId as uniqueId;
    commit;
`
}

/*
const readQueue:Procedure = {
    name: 'read_queue',
    params: [
        "_inOut tinyint", 
        "_moniker varchar(200)",
        "_queue bigint",
    ],
    label: '_exit',
    code:
`
    if _inOut=1 then
        select a.id as \`queue\`, b.moniker, a.body as \`data\`
            from queue_in a join moniker b on a.moniker=b.id
            where b.moniker=_moniker and a.id>_queue
            limit 1;
    else
        select a.id as \`queue\`, b.moniker, a.body as \`data\`
        from queue_out a join moniker b on a.moniker=b.id
        where b.moniker=_moniker and a.id>_queue
        limit 1;
    end if;
`
}
*/
const writeQueueIn:Procedure = {
    name: 'write_queue_in',
    params: [
        "_moniker varchar(200)",
        "_body text"
    ],
    label: '_exit',
    code:
`
    declare _monikerId int;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    insert into queue_in (moniker, body) values (_monikerId, _body);
`
}

const writeQueueOut:Procedure = {
    name: 'write_queue_out',
    params: [
        "_moniker varchar(200)",
        "_queue bigint",
        "_body text"
    ],
    label: '_exit',
    code:
`
    declare _monikerId int;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    insert into queue_out (moniker, body) values (_monikerId, _body);
    insert into queue_p (moniker, queue_out)
        values (_monikerId, _queue)
        on duplicate key update queue_out=_queue;
`
}

const readQueueIn:Procedure = {
    name: 'read_queue_in',
    params: [
        "_moniker varchar(200)",
    ],
    label: '_exit',
    code:
`
    declare _monikerId int;
    declare _queue bigint;
    select id into _monikerId from moniker where moniker=_moniker;
    if _monikerId is null then
        leave _exit;
    end if;

    select queue_in into _queue from queue_p where moniker=_monikerId;
    if _queue is null then
        set _queue=0;
    end if;

    select a.id, a.body, a.date
        from queue_in a
        where a.moniker=_monikerId
            and a.id>_queue
        limit 1;
`
}

const readQueueOut:Procedure = {
    name: 'read_queue_out',
    params: [
        "_moniker varchar(200)",
        "_queue bigint"
    ],
    label: '_exit',
    code:
`
    declare _monikerId int;
    select id into _monikerId from moniker where moniker=_moniker;
    if _monikerId is null then
        leave _exit;
    end if;

    if _queue is null then
        set _queue=0;
    end if;

    select a.id, a.body, a.date
        from queue_out a
        where a.moniker=_monikerId
            and a.id>_queue
        limit 1;
`
}

const writeQueueInP:Procedure = {
    name: 'write_queue_in_p',
    params: [
        "_moniker varchar(200)",
        "_queue BIGINT",
    ],
    label: '_exit',
    code:
`
    declare _monikerId int;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    insert into queue_p (moniker, queue_in)
        values (_monikerId, _queue)
        on duplicate key update queue_in=_queue;
`
}

const writeQueueOutP:Procedure = {
    name: 'write_queue_out_p',
    params: [
        "_moniker varchar(200)",
        "_queue BIGINT",
    ],
    label: '_exit',
    code:
`
    declare _monikerId int;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    insert into queue_p (moniker, queue_out)
        values (_monikerId, _queue)
        on duplicate key update queue_out=_queue;
`
}

export default [
    readQueueOutP, readQueueInP,
    //readQueue, 
    writeQueueIn, writeQueueOut,
    readQueueIn, readQueueOut, 
    writeQueueInP, writeQueueOutP
];
