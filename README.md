# EVA ICS Grafana Application

[EVA ICS](https://www.eva-ics.com)® is a modern SCADA/automation, control and
monitoring platform, for any needs, from home/office to industrial setups. It
is completely free for non-commercial use as well as for commercial, on
condition that Enterprise integrates it on its own and no Enterprise services
are required.

The application plugin installs EVA ICS v4 data-source, which allows to call
any EVA ICS [HMI HTTP
API](https://info.bma.ai/en/actual/eva4/svc/eva-hmi.html#http-api)
method in a query and get the result parsed in Grafana.

The application plugin also provides embedded HMI controls panel, which allows to place
HMI control buttons directly on Grafana dashboards.

<img src="https://pub.bma.ai/i/face_transparent.png" width="400" />

## Queries

The queries must be specified as:

```
method name=value name=value2 name=value3
```

the parameter "i" can be specified as the first one, with no name required. To
specify an array, separate values with comma. Map parameter values can be
specified as map.key=value.

## Aliases and examples

### Current item state

The current [item
state](https://info.bma.ai/en/actual/eva4/svc/eva-hmi.html#item-state) can be
obtained with "s" method (alias for "item.state"):

```
s sensor:tests/temp
```

The query can contain multiple OIDs or masks:

```
s sensor:tests/#,unit:tests/#
```

### State history

[Historical item
states](https://info.bma.ai/en/actual/eva4/svc/eva-hmi.html#item-state-history)
can be obtained with "h" method (alias for "item.state\_history"):

```
h sensor:tests/temp fill=100A prop=value
```

* it is recommended to specify the "fill" parameter with "A" instead of a time
frame to calculate number of dots automatically.

* the parameters "t\_start" and "t\_end" are set by Grafana plugin according to
the chosen dashboard/query range.

### System monitoring

Get the current node core state:

```
test
```

Get HMI API log (calls listed below require admin permissions):

```
api_log.get t_start=${from} t_end=${to}
```

Get all connected nodes:

```
bus::eva.core::node.list
```

Get advanced replication stats from a replication service instance (v4 nodes
only):

```
bus::eva.repl.default::node.list
```

Get list of active HMI sessions

```
bus::eva.hmi.default::session.list
```

### More info

See <https://info.bma.ai/en/actual/eva4/hmi/grafana/index.html>

### Copyright

&copy; 2023 [Bohemia Automation Ltd](https://www.bohemia-automation.com).
