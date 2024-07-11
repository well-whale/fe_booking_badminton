import React, { useEffect, useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation, Link, useParams } from "react-router-dom";
import { convertSlugToTitle } from "../../services/slugService"; // Ensure the path is correct
import { getCourtByIdCourt } from "../../services/UserServices"; // Ensure the path is correct

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const handleClick = (event) => {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
};

const CustomizedBreadcrumbs = ({ page , value}) => {
  const location = useLocation();
  const [courtName, setCourtName] = useState("");
  const pathnames = location.pathname.split("/").filter((x) => x);
  const params = useParams();
  const [courtId, setCourtId] = useState("");

  useEffect(() => {
    const fetchCourtName = async (idCourt) => {
      const res = await getCourtByIdCourt(idCourt);
      if (res.status === 200) {
        setCourtName(res.data.courtName);
      }
    };

    const courtDetailPath = pathnames.find((path) => path.startsWith("view"));
    if (courtDetailPath && params.idCourt) {
      setCourtId(params.idCourt)
      fetchCourtName(params.idCourt);
    }
  }, [pathnames, params.idCourt]);

  let breadcrumbs;
  switch (page) {
    case "search":
      breadcrumbs = (
        <Breadcrumbs>
          <StyledBreadcrumb
            component={Link}
            to="/"
            label="Trang chủ"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb component={Link} to="/search" label="Tìm Kiếm" />
        </Breadcrumbs>
      );
      break;
    case "booked":
      breadcrumbs = (
        <Breadcrumbs>
          <StyledBreadcrumb
            component={Link}
            to="/"
            label="Trang chủ"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb component={Link} to="/booked" label="Lịch sử đặt" />
        </Breadcrumbs>
      );
      break;
    case "courtDetail":
      breadcrumbs = (
        <Breadcrumbs>
          <StyledBreadcrumb
            component={Link}
            to="/"
            label="Trang chủ"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb component={Link} to="/search" label="Tìm Kiếm" />
          <StyledBreadcrumb component={Link}  label={courtName} />
        </Breadcrumbs>
      );
      break;
      case "bookingDay":
      breadcrumbs = (
        <Breadcrumbs>
          <StyledBreadcrumb
            component={Link}
            to="/"
            label="Trang chủ"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb component={Link} to="/search" label="Tìm Kiếm" />
          <StyledBreadcrumb component={Link} to={`/view/${courtId}`} label={courtName} />
          <StyledBreadcrumb component={Link}  label="Đặt sân ngày" />
        </Breadcrumbs>
      );
      break;
      case "bookingMonth":
      breadcrumbs = (
        <Breadcrumbs>
          <StyledBreadcrumb
            component={Link}
            to="/"
            label="Trang chủ"
            icon={<HomeIcon fontSize="small" />}
          />
           <StyledBreadcrumb component={Link} to="/search" label="Tìm Kiếm" />
          <StyledBreadcrumb component={Link} to={`/view/${courtId}`} label={courtName} />
          <StyledBreadcrumb component={Link}  label="Đặt sân cố định" />
          </Breadcrumbs>
      );
      break;
      case "paymentDay":
      breadcrumbs = (
        <Breadcrumbs maxItems={2} aria-label="breadcrumb">
          <StyledBreadcrumb
            component={Link}
            to="/"
            label="Trang chủ"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb component={Link} to="/search" label="Tìm Kiếm" />
          <StyledBreadcrumb component={Link} to={`/view/${courtId}`} label={courtName} />
          <StyledBreadcrumb component={Link}  label="Đặt sân ngày" />
          <StyledBreadcrumb component={Link}  label="Thanh Toán" />
        </Breadcrumbs>
      );
      break;
      case "paymentMonth":
        breadcrumbs = (
          <Breadcrumbs maxItems={2} aria-label="breadcrumb">
          <StyledBreadcrumb
            component={Link}
            to="/"
            label="Trang chủ"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb component={Link} to="/search" label="Tìm Kiếm" />
          <StyledBreadcrumb component={Link} to={`/view/${courtId}`} label={courtName} />
          <StyledBreadcrumb component={Link}  label="Đặt sân cố định" />
          <StyledBreadcrumb component={Link}  label="Thanh Toán" />
        </Breadcrumbs>
        );
        break;
    // Add more cases as needed
    default:
      breadcrumbs = (
        <Breadcrumbs>
          <StyledBreadcrumb
            component={Link}
            to="/"
            label="Trang chủ"
            icon={<HomeIcon fontSize="small" />}
          />
        </Breadcrumbs>
      );
      break;
  }

  return (
    <section className="Breadcrumbs">
      <div role="presentation" onClick={handleClick}>
        {breadcrumbs}
      </div>
    </section>
  );
};

export default CustomizedBreadcrumbs;
