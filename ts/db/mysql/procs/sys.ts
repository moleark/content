import {Procedure} from '../tool';

const stringTable:Procedure = {
    name: 'string_table',
    params: [
        "`_text` TEXT"
    ],
    label: '_exit',
    code:
`
    declare _cell, _c1, _c2, _c3, _c4 varchar(200);
    declare _p, _i, _c, _len int;
    declare _row int;
    DROP TABLE IF EXISTS StringTable;
    create temporary table IF NOT EXISTS StringTable(
        id int not null auto_increment, 
        c1 varchar(200),
        c2 varchar(200),
        c3 varchar(200),
        c4 varchar(200),
        PRIMARY KEY (id)
    );
    if _text is null then
        leave _exit;
    end if;
    set _len=CHAR_LENGTH(_text);
    if _len=0 then
        leave _exit;
    end if;

    set _row=1;
    set _p=0;
    set _i=1;
    set _c=1;

    loopLabel: LOOP
        set _p=_row;
        set _i=0;
        set _row=LOCATE(';', _text, _row);
        if _row=0 then
            set _row=_len+1;
        end if;
        rowLoop: LOOP
            if _p>_len then
                set _cell=null;
            else
                set _c=LOCATE('|', _text, _p);
                if _c>0 and _c<_row then
                    set _cell=TRIM(SUBSTR(_text, _p, _c-_p));
                    set _p=_c+1;
                else
                    set _cell=TRIM(SUBSTR(_text, _p, _row-_p));
                    set _p = _len+1;
                end if;
                if LENGTH(_cell)=0 then
                    set _cell=null;
                end if;
            end if;
            if _i=0 then
                set _c1=_cell;
            elseif _i=1 then
                set _c2=_cell;
            elseif _i=2 then
                set _c3=_cell;
            elseif _i=3 then
                set _c4=_cell;				
                leave rowLoop;
            else
                leave rowLoop; 
            end if;
            set _i=_i+1;
        END LOOP rowLoop;

        insert into StringTable (c1,c2,c3,c4) values (_c1, _c2, _c3, _c4);

        set _row=_row+1;
        if _row>_len then
            leave loopLabel;
        end if;
    END LOOP loopLabel;
`
}

export default [stringTable];
