import { Box, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const LoadingTable = ({ cols = 5, rows = 5 }) => (
  <Table>
    <TableHead>
      <TableRow>
        {Array(cols).fill(0).map((_, i) => (
          <TableCell key={i}><Skeleton variant="text" width={80} /></TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {Array(rows).fill(0).map((_, r) => (
        <TableRow key={r}>
          {Array(cols).fill(0).map((_, c) => (
            <TableCell key={c}><Skeleton variant="text" /></TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default LoadingTable;